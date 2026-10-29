import { useState, type MouseEvent as ReactMouseEvent } from "react";
import pathwayBgImg from "@/assets/kanji-tree-pathway.jpg";
import checkpointStoneImg from "@/assets/tree-checkpoint-stone.png";
import tanukiImg from "@/assets/tanuki.png";
import {
  CHAPTERS,
  EXTRA_KANJI,
  POS_LABELS,
  RADICALS,
  STEP_ORDER,
  atLeast,
  type Chapter,
  type Step,
} from "../data";
import { pick, useLang, useT } from "../i18n";
import { sfx, type Writing } from "../store";
import { MemoryScene } from "../Modals";
import { Modal } from "./Modal";
import { ShapedRadicalTile } from "./PouchModal";

/** Coordinates (% of container width/height) for the 6 checkpoints ascending the Great Kanji Tree. */
const PATHWAY_NODE_COORDS: { x: number; y: number }[] = [
  { x: 16, y: 80 }, // Lv 1: Roots / Stone Steps (休)
  { x: 33, y: 66 }, // Lv 2: Lower Trunk Bridge (明)
  { x: 48, y: 53 }, // Lv 3: Spiral Rune Hollow (岩)
  { x: 62, y: 41 }, // Lv 4: Mid-Canopy Lanterns (時)
  { x: 76, y: 29 }, // Lv 5: Upper Bough (男)
  { x: 87, y: 17 }, // Lv 6: Sunlit Crown (雪)
];

const QUEST_STEPS: {
  step: Step;
  icon: string;
  label: { en: string; ja: string; vi: string };
}[] = [
  {
    step: "arrival",
    icon: "🦉",
    label: { en: "Talk to Mori", ja: "モリと話す", vi: "Nói chuyện với Mori" },
  },
  {
    step: "mine",
    icon: "⛏️",
    label: { en: "Dig Radicals in Mine", ja: "部首鉱山で発掘", vi: "Đào Bộ Thủ ở Mỏ" },
  },
  {
    step: "shrine",
    icon: "⛩️",
    label: { en: "Picture Shrine Memory", ja: "絵神社の記憶", vi: "Ký Ức Miếu Tranh" },
  },
  {
    step: "bento",
    icon: "🍱",
    label: { en: "Assemble Kanji Bento", ja: "漢字弁当を組み立てる", vi: "Ghép Hộp Bento Kanji" },
  },
  {
    step: "write",
    icon: "🖌️",
    label: { en: "Write at Calligraphy Dojo", ja: "書道道場で書く", vi: "Viết tại Võ Đường Thư Pháp" },
  },
  {
    step: "restore",
    icon: "🌳",
    label: { en: "Restore the Kanji Tree", ja: "大漢字の木を修復", vi: "Khôi Phục Cây Kanji" },
  },
];

export type KanjiTreeModalProps = {
  currentChapterIndex: number;
  currentStep: Step;
  playerLevel: number;
  energy: number;
  maxEnergy: number;
  discovered: string[];
  journal: Writing[];
  onSelectChapter: (chapterIndex: number) => void;
  onQuickStepAction?: (step: Step) => void;
  onRestoreEnergy: () => void;
  onPracticeKanji?: (chapterIndex: number) => void;
  onInspectKanji?: (char: string, e: ReactMouseEvent) => void;
  onClose: () => void;
};

export function KanjiTreeModal({
  currentChapterIndex,
  currentStep,
  playerLevel,
  energy,
  maxEnergy,
  discovered,
  journal,
  onSelectChapter,
  onQuickStepAction,
  onRestoreEnergy,
  onPracticeKanji,
  onInspectKanji,
  onClose,
}: KanjiTreeModalProps) {
  const t = useT();
  const lang = useLang();
  const [activeTab, setActiveTab] = useState<"pathway" | "collection">("pathway");
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(currentChapterIndex);
  const [selectedCollectionChar, setSelectedCollectionChar] = useState<string>(
    CHAPTERS[currentChapterIndex]?.kanji.char ?? CHAPTERS[0]!.kanji.char,
  );

  const selectedChapter: Chapter =
    CHAPTERS[selectedChapterIdx] ?? CHAPTERS[currentChapterIndex] ?? CHAPTERS[0]!;

  const isChapterUnlocked = (idx: number, ch: Chapter) =>
    idx <= playerLevel || idx <= currentChapterIndex || discovered.includes(ch.kanji.char);

  const isChapterCompleted = (idx: number, ch: Chapter) =>
    discovered.includes(ch.kanji.char) &&
    (idx < currentChapterIndex || (idx === currentChapterIndex && currentStep === "done"));

  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      speechSynthesis.speak(u);
    } catch {
      /* speechSynthesis unavailable */
    }
  };

  const chapterMatch = CHAPTERS.find((c) => c.kanji.char === selectedCollectionChar);
  const extraMatch = EXTRA_KANJI[selectedCollectionChar];
  const savedWritings = journal.filter((w) => w.kanji === selectedCollectionChar);

  return (
    <Modal title={`🌳 ${t("treeCheckpointTitle")}`} onClose={onClose} wide>
      {/* Top Checkpoint Status & Energy Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#6e4b2a] bg-gradient-to-r from-[#ecd9b4] via-[#f5e7c8] to-[#e4f0df] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={checkpointStoneImg}
            alt="Kanji Checkpoint Stone"
            className="h-14 w-14 shrink-0 object-contain drop-shadow"
            draggable={false}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#4b8b55] px-2.5 py-0.5 text-xs font-extrabold text-white">
                {t("lv", { n: playerLevel })}
              </span>
              <span className="font-display text-base font-bold text-[#3b2818]">
                {t("treeCollectionProgress", {
                  count: discovered.length,
                  total: CHAPTERS.length,
                })}
              </span>
            </div>
            {/* Restoration Progress Bar */}
            <div className="mt-1.5 h-2.5 w-52 overflow-hidden rounded-full border border-[#6e4b2a]/50 bg-[#d8c39e] sm:w-64">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4b8b55] to-[#78b856] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((discovered.length / CHAPTERS.length) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher + Rest Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border-2 border-[#6e4b2a] bg-[#e2cca4] p-1">
            <button
              type="button"
              onClick={() => {
                sfx("tap");
                setActiveTab("pathway");
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition sm:text-sm ${
                activeTab === "pathway"
                  ? "bg-[#4b8b55] text-white shadow-sm"
                  : "text-[#3b2818] hover:bg-[#ecd9b4]"
              }`}
            >
              🗺️ {t("levelPathwayTab")}
            </button>
            <button
              type="button"
              onClick={() => {
                sfx("tap");
                setActiveTab("collection");
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition sm:text-sm ${
                activeTab === "collection"
                  ? "bg-[#4b8b55] text-white shadow-sm"
                  : "text-[#3b2818] hover:bg-[#ecd9b4]"
              }`}
            >
              🈶 {t("kanjiCollectionTab")} ({discovered.length}/{CHAPTERS.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onRestoreEnergy();
            }}
            disabled={energy >= maxEnergy}
            className={`rounded-xl border-2 border-[#4e341e] px-3 py-2 text-xs font-extrabold shadow-sm transition ${
              energy < maxEnergy
                ? "bg-[#f0b429] text-[#3b2818] hover:bg-[#f5c44e]"
                : "cursor-default bg-[#ecd9b4]/70 text-[#6e4f35] opacity-75"
            }`}
          >
            ⚡ {energy}/{maxEnergy} · {t("restAtTreeBtn")}
          </button>
        </div>
      </div>

      {/* TAB 1: LEVEL PATHWAY */}
      {activeTab === "pathway" && (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* Left: Interactive Great Kanji Tree Pathway Map */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-4 border-[#6e4b2a] bg-[#2a1d12] shadow-lg">
            <img
              src={pathwayBgImg}
              alt="Great Kanji Tree Pathway"
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

            {/* SVG Winding Trail connecting all 6 Level Checkpoints */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              {/* Outer dark path border */}
              <path
                d="M 16 80 Q 25 74, 33 66 T 48 53 T 62 41 T 76 29 T 87 17"
                fill="none"
                stroke="#3b2818"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Golden glowing inner dashed trail */}
              <path
                d="M 16 80 Q 25 74, 33 66 T 48 53 T 62 41 T 76 29 T 87 17"
                fill="none"
                stroke="#f6df96"
                strokeWidth="1.2"
                strokeDasharray="2.5 2"
                strokeLinecap="round"
              />
            </svg>

            {/* 6 Level Nodes along the Tree Pathway */}
            {CHAPTERS.map((ch, idx) => {
              const coord = PATHWAY_NODE_COORDS[idx] ?? { x: 50, y: 50 };
              const unlocked = isChapterUnlocked(idx, ch);
              const completed = isChapterCompleted(idx, ch);
              const isCurrent = idx === currentChapterIndex;
              const isSelected = idx === selectedChapterIdx;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    sfx("tap");
                    setSelectedChapterIdx(idx);
                  }}
                  style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                    isSelected ? "z-20 scale-110" : "z-10"
                  }`}
                >
                  {/* Active Player Mochi Marker */}
                  {isCurrent && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 animate-bob">
                      <img
                        src={tanukiImg}
                        alt="Mochi"
                        className="h-9 w-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                  )}

                  {/* Checkpoint Node Circle */}
                  <div
                    className={`relative flex h-14 w-14 flex-col items-center justify-center rounded-full border-4 shadow-xl transition sm:h-16 sm:w-16 ${
                      completed
                        ? "border-[#f6df96] bg-[#4b8b55] text-white"
                        : isCurrent
                          ? "border-[#ffd166] bg-[#d97724] text-white ring-4 ring-[#ffd166]/60"
                          : unlocked
                            ? "border-[#6e4b2a] bg-[#f7ecd5] text-[#3b2818]"
                            : "border-[#5a4634] bg-[#3b2818]/90 text-[#b8a388]"
                    } ${isSelected ? "ring-4 ring-white" : ""}`}
                  >
                    <span className="text-[10px] font-extrabold uppercase leading-none opacity-90">
                      Lv.{ch.num}
                    </span>
                    <span className="font-kanji text-xl font-bold leading-tight sm:text-2xl">
                      {unlocked || completed ? ch.kanji.char : "🔒"}
                    </span>
                    {completed && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#3b2818] bg-[#f6df96] text-[10px] font-extrabold text-[#3b2818]">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Floating Label Pill under Node */}
                  <div className="mt-1 whitespace-nowrap rounded-full border border-[#3b2818] bg-[#f7ecd5]/95 px-2 py-0.5 text-[10px] font-extrabold text-[#3b2818] shadow">
                    {pick(ch.kanji.meaning, lang)}
                  </div>
                </button>
              );
            })}

            {/* Bottom Legend Overlay */}
            <div className="absolute bottom-2.5 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#6e4b2a]/80 bg-[#2b1d12]/85 px-3 py-1.5 text-xs text-[#f7ecd5] backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#4b8b55]" />
                  {t("checkpointCleared")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#d97724]" />
                  {t("currentCheckpoint")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#5a4634]" />
                  {t("checkpointLocked")}
                </span>
              </div>
              <span className="font-bold text-[#f6df96]">
                {t("chapterLabel", {
                  num: selectedChapter.num,
                  title: pick(selectedChapter.title, lang),
                })}
              </span>
            </div>
          </div>

          {/* Right: Selected Level Checkpoint Details & 6-Step Quest Pathway */}
          <div className="flex flex-col justify-between rounded-2xl border-3 border-[#6e4b2a] bg-[#fbf5e6] p-4 shadow-md">
            <div>
              {/* Selected Chapter Header */}
              <div className="flex items-start justify-between gap-3 border-b-2 border-[#e2cfa9] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-3 border-[#6e4b2a] bg-[#ecd9b4] font-kanji text-4xl font-bold text-[#3b2818] shadow-inner">
                    {isChapterUnlocked(selectedChapterIdx, selectedChapter)
                      ? selectedChapter.kanji.char
                      : "？"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#6e4b2a] px-2 py-0.5 text-xs font-extrabold text-[#f7ecd5]">
                        LEVEL {selectedChapter.num}
                      </span>
                      {selectedChapterIdx === currentChapterIndex && (
                        <span className="rounded-md bg-[#d97724] px-2 py-0.5 text-xs font-extrabold text-white">
                          ● {t("currentActiveChapter")}
                        </span>
                      )}
                      {isChapterCompleted(selectedChapterIdx, selectedChapter) && (
                        <span className="rounded-md bg-[#4b8b55] px-2 py-0.5 text-xs font-extrabold text-white">
                          ✓ {t("checkpointCleared")}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#3b2818]">
                      {pick(selectedChapter.title, lang)}
                    </h3>
                    <p className="text-xs font-bold text-[#6e4f35]">
                      {isChapterUnlocked(selectedChapterIdx, selectedChapter)
                        ? `${pick(selectedChapter.kanji.meaning, lang)} · ${selectedChapter.kanji.on} · ${selectedChapter.kanji.kun}`
                        : t("reachLevel", { n: selectedChapter.num - 1 })}
                    </p>
                  </div>
                </div>

                {/* Required Radicals Preview */}
                <div className="flex items-center gap-1 rounded-xl border border-[#d6c098] bg-[#f3e4c4] px-2.5 py-1.5">
                  <span className="font-kanji text-lg font-bold text-[#3b2818]">
                    {selectedChapter.digChars[0]}
                  </span>
                  <span className="text-xs font-bold text-[#6e4f35]">+</span>
                  <span className="font-kanji text-lg font-bold text-[#3b2818]">
                    {selectedChapter.digChars[1]}
                  </span>
                </div>
              </div>

              {/* 6-Step Sub-Pathway inside this Level */}
              <div className="mt-3">
                <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[#6e4f35]">
                  {t("questPathwayTitle")}
                </div>
                <div className="space-y-1.5">
                  {QUEST_STEPS.map((q, sIdx) => {
                    const chapCompleted = isChapterCompleted(selectedChapterIdx, selectedChapter);
                    const isCurrentChap = selectedChapterIdx === currentChapterIndex;

                    const stepDone =
                      chapCompleted ||
                      (isCurrentChap &&
                        STEP_ORDER.indexOf(currentStep) > STEP_ORDER.indexOf(q.step));
                    const stepActive = isCurrentChap && currentStep === q.step;
                    const canTriggerStep =
                      isCurrentChap && atLeast(currentStep, q.step) && !!onQuickStepAction;

                    return (
                      <button
                        key={q.step}
                        type="button"
                        disabled={!canTriggerStep}
                        onClick={() => {
                          if (canTriggerStep && onQuickStepAction) {
                            sfx("tap");
                            onQuickStepAction(q.step);
                          }
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border-2 px-3 py-2 text-left transition ${
                          stepActive
                            ? "border-[#d97724] bg-[#fff3d6] shadow-xs"
                            : stepDone
                              ? "border-[#4b8b55]/60 bg-[#e9f4e7]"
                              : "border-[#dfd0b2] bg-[#f5ead4]/60 opacity-75"
                        } ${canTriggerStep ? "cursor-pointer hover:scale-[1.01]" : "cursor-default"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                              stepDone
                                ? "bg-[#4b8b55] text-white"
                                : stepActive
                                  ? "bg-[#d97724] text-white"
                                  : "bg-[#d8c39e] text-[#5c3e26]"
                            }`}
                          >
                            {stepDone ? "✓" : sIdx + 1}
                          </span>
                          <span className="text-base">{q.icon}</span>
                          <div>
                            <div className="text-xs font-extrabold text-[#3b2818] sm:text-sm">
                              {pick(q.label, lang)}
                            </div>
                            {stepActive && (
                              <div className="text-[11px] font-semibold text-[#b85d14]">
                                {pick(selectedChapter.objectives[currentStep], lang)}
                              </div>
                            )}
                          </div>
                        </div>

                        {stepActive && canTriggerStep && (
                          <span className="rounded-lg bg-[#d97724] px-2 py-0.5 text-[11px] font-extrabold text-white">
                            Go →
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons for Selected Level */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#e2cfa9] pt-3">
              <button
                type="button"
                onClick={() => {
                  sfx("tap");
                  setSelectedCollectionChar(selectedChapter.kanji.char);
                  setActiveTab("collection");
                }}
                className="rounded-xl border-2 border-[#6e4b2a] bg-[#ecd9b4] px-3.5 py-2 text-xs font-extrabold text-[#3b2818] transition hover:bg-[#e2c99d]"
              >
                🔍 {t("kanjiCollectionTab")} ({selectedChapter.kanji.char})
              </button>

              {isChapterUnlocked(selectedChapterIdx, selectedChapter) &&
                selectedChapterIdx !== currentChapterIndex && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectChapter(selectedChapterIdx);
                      onClose();
                    }}
                    className="rounded-xl border-2 border-[#3b6e43] bg-[#4b8b55] px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#3f7848]"
                  >
                    🌟 {t("travelToChapter", { num: selectedChapter.num })}
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KANJI COLLECTION & SPIRIT INSPECTOR */}
      {activeTab === "collection" && (
        <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: Sacred Tree Kanji Collection + Bonus Forest Kanji */}
          <div className="space-y-4 rounded-2xl border-3 border-[#6e4b2a] bg-[#fbf5e6] p-4">
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#3b2818]">
                  🌳 {t("greatKanjiTree")} · {t("kanjiLearned")}
                </h3>
                <span className="rounded-full bg-[#ecd9b4] px-2.5 py-0.5 text-xs font-extrabold text-[#5c3e26]">
                  {discovered.length} / {CHAPTERS.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {CHAPTERS.map((ch) => {
                  const unlocked = discovered.includes(ch.kanji.char);
                  const isSelected = selectedCollectionChar === ch.kanji.char;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        sfx("tap");
                        setSelectedCollectionChar(ch.kanji.char);
                      }}
                      className={`flex flex-col items-center justify-between rounded-2xl border-3 p-3 text-center transition hover:scale-[1.02] ${
                        isSelected
                          ? "border-[#4b8b55] bg-[#e6f3e4] ring-2 ring-[#4b8b55]"
                          : unlocked
                            ? "border-[#6e4b2a] bg-[#f5e7c8]"
                            : "border-[#c8b28e] bg-[#efe3c8]/60 opacity-75"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between text-[10px] font-extrabold text-[#6e4f35]">
                        <span>Lv.{ch.num}</span>
                        <span>{unlocked ? "✦ Restored" : "🔒 Sealed"}</span>
                      </div>

                      <div className="my-1 font-kanji text-4xl font-bold text-[#3b2818]">
                        {ch.kanji.char}
                      </div>

                      <div className="text-xs font-extrabold text-[#3b2818]">
                        {pick(ch.kanji.meaning, lang)}
                      </div>
                      <div className="mt-1 rounded-md bg-[#e2cca4]/80 px-2 py-0.5 font-kanji text-[11px] font-bold text-[#5c3e26]">
                        {ch.digChars[0]} + {ch.digChars[1]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bonus Forest Kanji Dictionary Grid */}
            <div className="border-t-2 border-[#e2cfa9] pt-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6e4f35]">
                  🍃 {t("forestWordsDiscovered")} ({Object.keys(EXTRA_KANJI).length})
                </h4>
              </div>
              <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {Object.values(EXTRA_KANJI).map((item) => {
                  const isSelected = selectedCollectionChar === item.char;
                  return (
                    <button
                      key={item.char}
                      type="button"
                      onClick={() => {
                        sfx("tap");
                        setSelectedCollectionChar(item.char);
                      }}
                      className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl border-2 font-kanji text-lg font-bold transition ${
                        isSelected
                          ? "border-[#4b8b55] bg-[#4b8b55] text-white"
                          : "border-[#c8b28e] bg-[#f4e6c8] text-[#3b2818] hover:border-[#6e4b2a]"
                      }`}
                    >
                      <span>{item.char}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Kanji Spirit Card Inspector */}
          <div className="flex flex-col justify-between rounded-2xl border-3 border-[#6e4b2a] bg-[#fbf5e6] p-4 shadow-md">
            {chapterMatch ? (
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3 border-b-2 border-[#e2cfa9] pb-3">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-3 border-[#6e4b2a] bg-[#ecd9b4] font-kanji text-5xl font-bold text-[#3b2818] shadow-inner">
                      {chapterMatch.kanji.char}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {chapterMatch.kanji.pos.map((p) => (
                          <span
                            key={p}
                            className="rounded-full bg-[#4b8b55]/15 px-2.5 py-0.5 text-[11px] font-extrabold text-[#2f6337]"
                          >
                            {pick(POS_LABELS[p], lang)}
                          </span>
                        ))}
                        <span className="rounded-full bg-[#ecd9b4] px-2 py-0.5 text-[11px] font-bold text-[#5c3e26]">
                          {chapterMatch.kanji.strokes} strokes
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#3b2818]">
                        {pick(chapterMatch.kanji.meaning, lang)}
                      </h3>
                      <div className="text-xs font-bold text-[#6e4f35]">
                        {chapterMatch.kanji.on} · {chapterMatch.kanji.kun}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => speak(chapterMatch.kanji.char)}
                    className="rounded-xl border-2 border-[#6e4b2a] bg-[#ecd9b4] px-3 py-1.5 text-sm font-bold text-[#3b2818] hover:bg-[#e1c89b]"
                  >
                    🔊
                  </button>
                </div>

                {/* Radical Composition + Story */}
                <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                  <div className="space-y-2">
                    <div className="text-xs font-extrabold uppercase text-[#6e4f35]">
                      {t("builtFrom")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <ShapedRadicalTile char={chapterMatch.digChars[0]} compact />
                        <span className="mt-0.5 text-[10px] font-bold text-[#5c3e26]">
                          {RADICALS[chapterMatch.digChars[0]]
                            ? pick(RADICALS[chapterMatch.digChars[0]]!.meaning, lang)
                            : ""}
                        </span>
                      </div>
                      <span className="font-display text-lg font-bold text-[#6e4f35]">+</span>
                      <div className="flex flex-col items-center">
                        <ShapedRadicalTile char={chapterMatch.digChars[1]} compact />
                        <span className="mt-0.5 text-[10px] font-bold text-[#5c3e26]">
                          {RADICALS[chapterMatch.digChars[1]]
                            ? pick(RADICALS[chapterMatch.digChars[1]]!.meaning, lang)
                            : ""}
                        </span>
                      </div>
                    </div>
                    <p className="rounded-xl border border-[#dfd0b2] bg-[#f5ead4] p-2.5 text-xs leading-relaxed text-[#3b2818]">
                      {pick(chapterMatch.kanji.story, lang)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between gap-2">
                    <MemoryScene scene={chapterMatch.scene} />
                  </div>
                </div>

                {/* Vocabulary List */}
                <div>
                  <div className="mb-1.5 text-xs font-extrabold uppercase text-[#6e4f35]">
                    {t("vocabTab")}
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-3">
                    {chapterMatch.kanji.vocab.map((v) => (
                      <button
                        key={v.jp}
                        type="button"
                        onClick={(e) => {
                          speak(v.jp);
                          onInspectKanji?.(chapterMatch.kanji.char, e);
                        }}
                        className="flex flex-col justify-between rounded-xl border border-[#d4be98] bg-[#f6ebd4] px-2.5 py-1.5 text-left transition hover:border-[#4b8b55]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-kanji text-base font-bold text-[#3b2818]">
                            {v.jp}
                          </span>
                          <span className="text-xs">🔊</span>
                        </div>
                        <div className="text-[11px] text-[#6e4f35]">{v.kana}</div>
                        <div className="text-xs font-bold text-[#4b8b55]">{pick(v.en, lang)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saved Player Calligraphy Preview */}
                {savedWritings.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#d4be98] bg-[#f6ebd4] p-2">
                    <img
                      src={savedWritings[savedWritings.length - 1]!.image}
                      alt={chapterMatch.kanji.char}
                      className="h-12 w-12 rounded-lg border border-[#6e4b2a] bg-white object-contain"
                    />
                    <div className="text-xs font-bold text-[#3b2818]">
                      ✓ {t("savedToJournal")} ({savedWritings.length})
                    </div>
                  </div>
                )}
              </div>
            ) : extraMatch ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b-2 border-[#e2cfa9] pb-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-3 border-[#6e4b2a] bg-[#ecd9b4] font-kanji text-5xl font-bold text-[#3b2818]">
                    {extraMatch.char}
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {extraMatch.pos.map((p) => (
                        <span
                          key={p}
                          className="rounded-full bg-[#4b8b55]/15 px-2.5 py-0.5 text-xs font-extrabold text-[#2f6337]"
                        >
                          {pick(POS_LABELS[p], lang)}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#3b2818]">
                      {pick(extraMatch.meaning, lang)}
                    </h3>
                    <div className="text-sm font-bold text-[#6e4f35]">
                      {extraMatch.on} · {extraMatch.kun}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Inspector Footer Actions */}
            {chapterMatch && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#e2cfa9] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const idx = CHAPTERS.findIndex((c) => c.id === chapterMatch.id);
                    if (idx >= 0) {
                      setSelectedChapterIdx(idx);
                      setActiveTab("pathway");
                    }
                  }}
                  className="rounded-xl border-2 border-[#6e4b2a] bg-[#ecd9b4] px-3.5 py-2 text-xs font-extrabold text-[#3b2818] hover:bg-[#e1c89b]"
                >
                  🗺️ {t("levelPathwayTab")} (Lv.{chapterMatch.num})
                </button>

                {onPracticeKanji && (
                  <button
                    type="button"
                    onClick={() => {
                      const idx = CHAPTERS.findIndex((c) => c.id === chapterMatch.id);
                      if (idx >= 0) onPracticeKanji(idx);
                    }}
                    className="rounded-xl border-2 border-[#3b6e43] bg-[#4b8b55] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#3f7848]"
                  >
                    🖌️ {t("practiceBtn")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default KanjiTreeModal;
