import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { CATALOG, CHAPTERS, RADICALS, type Chapter, type Line } from "./data";
import { sfx, isFuriganaEnabled, type MapName, type Piece, type Writing } from "./store";
import { pick, useLang, useT } from "./i18n";
import { Furigana } from "./Furigana";
import { ClickableKanjiText } from "./components/ClickableKanjiText";
import { Modal } from "./components/Modal";
import { JournalStrip } from "./components/JournalStrip";
import { ShapedRadicalTile } from "./components/PouchModal";
import { StrokeDemo } from "./features/calligraphy/StrokeDemo";
import { useCalligraphyStrokes } from "./features/calligraphy/useCalligraphyStrokes";
import moriImg from "@/assets/mori.png";
import tanukiImg from "@/assets/tanuki.png";
import mapImg from "@/assets/map.jpg";
import mineMapImg from "@/assets/mine-map.jpg";
import memoryImg from "@/assets/memory-rest.jpg";
import timeImg from "@/assets/time.jpg";
import maleImg from "@/assets/male.jpg";
import snowImg from "@/assets/snow.jpg";

export { Modal };
export { Calligraphy } from "./features/calligraphy/Calligraphy";
export { StrokeDemo };

export function Dialogue({
  lines,
  onDone,
  onInspectKanji,
  onAdvance,
}: {
  lines: Line[];
  onDone: () => void;
  onInspectKanji?: (char: string, e: ReactMouseEvent) => void;
  onAdvance?: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [i, setI] = useState(0);
  const line = lines[i];
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.tagName === "INPUT" || el?.tagName === "TEXTAREA") return;
      if (el?.closest?.('[role="button"], button, a')) return;
      if (e.key === " " || e.key === "Enter" || e.key === "e") next();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const next = () => {
    sfx("tap");
    onAdvance?.();
    if (i + 1 < lines.length) setI(i + 1);
    else onDone();
  };
  if (!line) return null;
  const isMori = line.who === "mori";
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 flex justify-center p-4"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest?.('[role="button"], button, a, input, textarea'))
          return;
        next();
      }}
    >
      <div className="panel animate-pop relative flex w-full max-w-3xl cursor-pointer items-center gap-4 border-4 border-[#6e4b2a] bg-[#f6ebd4] p-4 shadow-2xl">
        <div className="relative -mt-10 flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-[#6e4b2a] bg-[#ecd9b4] shadow-md">
          <img
            src={isMori ? moriImg : tanukiImg}
            alt=""
            className="h-24 w-24 object-contain drop-shadow-md"
          />
        </div>
        <div className="flex-1">
          <div className="mb-1.5 inline-block rounded-xl border-2 border-[#6e4b2a] bg-[#ecd9b4] px-3.5 py-0.5 font-display text-sm font-bold text-[#3b2818]">
            {isMori ? t("moriTitle") : t("tanukiTitle")}
          </div>
          <p className="text-lg font-medium leading-snug text-[#3b2818]">
            {lang === "ja" ? (
              <ClickableKanjiText
                jp={line.text.ja}
                kana={line.kana}
                enableFurigana={isFuriganaEnabled()}
                onInspect={onInspectKanji}
              />
            ) : (
              pick(line.text, lang)
            )}
          </p>
          <p className="mt-1 text-right text-sm font-bold text-[#6e4f35] animate-bob">
            {t("tapSpace")}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Hand-painted style memory picture shown by the Picture Shrine. */
export function MemoryScene({ scene }: { scene: Chapter["scene"] }) {
  if (scene === "rest") {
    return (
      <img
        src={memoryImg}
        alt="Someone resting against a tree"
        className="w-full rounded-xl border-4 border-wood object-cover"
      />
    );
  }
  if (scene === "bright") {
    return (
      <svg
        viewBox="0 0 400 300"
        className="w-full rounded-xl border-4 border-wood"
        role="img"
        aria-label="The sun and the moon sharing the sky"
      >
        <rect width="400" height="300" fill="#BFD8E8" />
        <circle cx="110" cy="90" r="46" fill="#E8C46A" />
        <g stroke="#E8C46A" strokeWidth="6" strokeLinecap="round">
          <line x1="110" y1="20" x2="110" y2="34" />
          <line x1="110" y1="146" x2="110" y2="160" />
          <line x1="40" y1="90" x2="54" y2="90" />
          <line x1="166" y1="90" x2="180" y2="90" />
          <line x1="60" y1="40" x2="70" y2="50" />
          <line x1="150" y1="130" x2="160" y2="140" />
          <line x1="160" y1="40" x2="150" y2="50" />
          <line x1="70" y1="130" x2="60" y2="140" />
        </g>
        <circle cx="290" cy="100" r="42" fill="#F5EFDF" />
        <circle cx="278" cy="88" r="34" fill="#BFD8E8" />
        <path d="M0 210 Q100 170 200 205 T400 200 L400 300 L0 300 Z" fill="#8FA98A" />
        <path d="M0 250 Q120 220 240 250 T400 245 L400 300 L0 300 Z" fill="#6E8B6A" />
      </svg>
    );
  }
  if (scene === "time") {
    return (
      <img
        src={timeImg}
        alt="The sun casting a shadow beside a temple"
        className="w-full rounded-xl border-4 border-wood object-cover"
      />
    );
  }
  if (scene === "field") {
    return (
      <img
        src={maleImg}
        alt="A person working in a green rice field"
        className="w-full rounded-xl border-4 border-wood object-cover"
      />
    );
  }
  if (scene === "snow") {
    return (
      <img
        src={snowImg}
        alt="A snowy forest with falling snow"
        className="w-full rounded-xl border-4 border-wood object-cover"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full rounded-xl border-4 border-wood"
      role="img"
      aria-label="A mountain standing on stone"
    >
      <rect width="400" height="300" fill="#DCEAF3" />
      <path d="M40 230 L200 60 L360 230 Z" fill="#A8A29A" />
      <path d="M200 60 L360 230 L330 230 L200 90 Z" fill="#C9C4BB" />
      <path d="M40 230 L200 60 L185 60 L40 215 Z" fill="#7D776F" />
      <path d="M0 230 Q100 210 200 225 T400 220 L400 300 L0 300 Z" fill="#8FA98A" />
      <ellipse cx="120" cy="255" rx="52" ry="30" fill="#9CA39B" />
      <ellipse cx="150" cy="250" rx="40" ry="24" fill="#C9C4BB" />
      <ellipse cx="280" cy="262" rx="60" ry="32" fill="#7D776F" />
      <ellipse cx="300" cy="258" rx="42" ry="22" fill="#A8A29A" />
    </svg>
  );
}

/** Shared helper banner when player energy reaches 0. */
function TiredRecoveryBanner({
  energy,
  onRestoreEnergy,
}: {
  energy: number;
  onRestoreEnergy?: (() => void) | undefined;
}) {
  const t = useT();
  if (energy > 0) return null;
  return (
    <div className="mb-4 flex flex-col items-center justify-between gap-3 rounded-2xl border-2 border-red-700/60 bg-red-100/90 p-3 text-center sm:flex-row sm:text-left">
      <div>
        <div className="font-display text-base font-bold text-red-900">
          💤 {t("mochiTiredTitle")}
        </div>
        <p className="text-xs text-red-800">{t("mochiTiredDesc")}</p>
      </div>
      {onRestoreEnergy && (
        <button
          type="button"
          onClick={onRestoreEnergy}
          className="btn-game shrink-0 bg-[#4b8b55] text-xs text-white"
        >
          {t("restAndRecover")}
        </button>
      )}
    </div>
  );
}

export function ShrineModal({
  chapter,
  pieces,
  energy = 5,
  onWrongAnswer,
  onRestoreEnergy,
  onSolve,
  onClose,
}: {
  chapter: Chapter;
  pieces: Piece[];
  energy?: number;
  onWrongAnswer?: () => void;
  onRestoreEnergy?: () => void;
  onSolve: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const options = chapter.shrineOptions;
  const owned = new Set(pieces.map((p) => p.char));
  const [picked, setPicked] = useState<string[]>([]);
  const [bad, setBad] = useState(false);

  const toggle = (c: string) => {
    if (energy <= 0) return;
    sfx("tap");
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  };

  const check = () => {
    if (energy <= 0) return;
    const ok =
      picked.length === 2 &&
      picked.includes(chapter.digChars[0]) &&
      picked.includes(chapter.digChars[1]);
    if (ok) {
      sfx("good");
      onSolve();
    } else {
      sfx("bad");
      setBad(true);
      onWrongAnswer?.();
      setTimeout(() => setBad(false), 700);
    }
  };

  return (
    <Modal title={t("shrineTitle")} onClose={onClose} wide>
      <TiredRecoveryBanner energy={energy} onRestoreEnergy={onRestoreEnergy} />
      <div className="grid gap-5 md:grid-cols-2">
        <MemoryScene scene={chapter.scene} />
        <div className="flex flex-col gap-3">
          <p className="text-lg">
            {t("memoryOpens")}
            <b>{pick(chapter.kanji.story, lang)}</b>
          </p>
          <p className="text-muted-foreground">{t("whichPieces")}</p>
          <div className={`grid grid-cols-2 gap-3 ${bad ? "animate-shake" : ""}`}>
            {options.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                disabled={energy <= 0}
                className={`tile h-24 flex-col text-4xl transition ${
                  picked.includes(c) ? "ring-4 ring-success" : ""
                } ${owned.has(c) ? "" : "opacity-60"}`}
              >
                {c}
                <span className="font-sans text-xs text-muted-foreground">
                  {RADICALS[c]?.meaning ? pick(RADICALS[c].meaning, lang) : ""}
                </span>
              </button>
            ))}
          </div>
          <button
            className="btn-game btn-accent mt-2"
            disabled={energy <= 0}
            onClick={check}
          >
            {t("remember")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Kanji Bento Modal — updated to match middle-left of game-ui-design.png:
 * - Left: Wooden Bento Grid with dashed white kanji guide outline
 * - Right: Assemble instructions + shaped wooden radical pieces
 * - Deducts 1 Energy on wrong slot placement or wrong lid check
 */
export function BentoModal({
  chapter,
  pieces,
  energy = 5,
  onWrongAnswer,
  onRestoreEnergy,
  onSolve,
  onClose,
}: {
  chapter: Chapter;
  pieces: Piece[];
  energy?: number;
  onWrongAnswer?: () => void;
  onRestoreEnergy?: () => void;
  onSolve: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [slots, setSlots] = useState<(Piece | null)[]>([null, null]);
  const [sel, setSel] = useState<Piece | null>(null);
  const [state, setState] = useState<"idle" | "bad" | "merged">("idle");

  // Combine player's collected pieces with decoy shapes so the tray matches game-ui-design.png
  const allTrayPieces: Piece[] = [
    ...pieces,
    ...(pieces.some((p) => p.char === "一")
      ? []
      : [{ id: "decoy_h", char: "一", size: "1x4" as const }]),
    ...(pieces.some((p) => p.char === "冂")
      ? []
      : [{ id: "decoy_enc", char: "冂", size: "2x3" as const }]),
  ];
  const tray = allTrayPieces.filter((p) => !slots.some((s) => s?.id === p.id));

  const radicalMeaning = (c: string) =>
    RADICALS[c] ? pick(RADICALS[c].meaning, lang) : "";

  const place = (i: number) => {
    if (state === "merged" || energy <= 0) return;
    if (slots[i]) {
      sfx("tap");
      setSlots((s) => s.map((x, j) => (j === i ? null : x)));
      return;
    }
    if (!sel) return;

    // Phase 3 Penalty Logic: check if the selected radical belongs in slot `i`
    const expectedChar = chapter.digChars[i];
    if (sel.char !== expectedChar) {
      sfx("bad");
      setState("bad");
      onWrongAnswer?.();
      setSel(null);
      setTimeout(() => setState("idle"), 650);
      return;
    }

    sfx("tap");
    const nextSlots = slots.map((x, j) => (j === i ? sel : x));
    setSlots(nextSlots);
    setSel(null);

    // Auto-merge if both compartments now hold the correct radicals
    if (
      nextSlots[0]?.char === chapter.digChars[0] &&
      nextSlots[1]?.char === chapter.digChars[1]
    ) {
      sfx("chime");
      setState("merged");
      setTimeout(onSolve, 1300);
    }
  };

  const check = () => {
    if (energy <= 0) return;
    if (
      slots[0]?.char === chapter.digChars[0] &&
      slots[1]?.char === chapter.digChars[1]
    ) {
      sfx("chime");
      setState("merged");
      setTimeout(onSolve, 1300);
    } else {
      sfx("bad");
      setState("bad");
      onWrongAnswer?.();
      setTimeout(() => {
        setSlots([null, null]);
        setState("idle");
      }, 700);
    }
  };

  return (
    <Modal title={`🍱 ${t("bentoTitle")}`} onClose={onClose} wide>
      <TiredRecoveryBanner energy={energy} onRestoreEnergy={onRestoreEnergy} />

      <div className="grid gap-6 md:grid-cols-[1.05fr_1fr]">
        {/* Left: Dark Wooden Bento Box with 4x4 grid & dashed white kanji layout guide */}
        <div
          className={`relative mx-auto flex aspect-square w-full max-w-[340px] overflow-hidden rounded-2xl border-[8px] border-[#4e341e] bg-[#6d4c30] p-3 shadow-xl ${
            state === "bad" ? "animate-shake ring-4 ring-red-500" : ""
          }`}
        >
          {/* Background 4x4 Bento Grid Lines */}
          <div className="pointer-events-none absolute inset-3 grid grid-cols-4 grid-rows-4 rounded-xl border-2 border-[#4e341e]/80">
            {Array.from({ length: 16 }, (_, idx) => (
              <div key={idx} className="border border-[#5a3d24]/60" />
            ))}
          </div>

          {/* Dashed White Kanji Guide Overlay (matches game-ui-design.png) */}
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-5 h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] opacity-75"
          >
            <line
              x1="40"
              y1="6"
              x2="40"
              y2="94"
              stroke="white"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            {chapter.strokes.map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="none"
                stroke="white"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
            ))}
          </svg>

          {state === "merged" ? (
            <div className="animate-pop relative z-10 flex flex-1 items-center justify-center rounded-xl bg-[#f7eed9]/95 font-kanji text-9xl text-[#3b2818] shadow-inner">
              {chapter.kanji.char}
            </div>
          ) : (
            <div className="relative z-10 flex flex-1 gap-2">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  type="button"
                  disabled={energy <= 0}
                  onClick={() => place(i)}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed font-kanji text-7xl transition ${
                    i === 0 ? "w-2/5" : "flex-1"
                  } ${
                    slots[i]
                      ? "border-[#4b8b55] bg-[#f3dfb9]/95 text-[#3b2818] shadow-md"
                      : "border-white/60 bg-black/10 text-white hover:bg-white/10"
                  } ${sel && !slots[i] ? "animate-pulse ring-2 ring-[#f3dfb9]" : ""}`}
                >
                  <span>{slots[i]?.char ?? ""}</span>
                  {!slots[i] && (
                    <span className="mt-2 font-sans text-xs font-bold text-white/85">
                      {radicalMeaning(chapter.digChars[i]!)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Assemble Instructions + Shaped Radical Tray */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[#3b2818]">
              {t("assembleKanji")}
            </h3>
            <p className="mt-1 text-sm text-[#5c3e26]">{t("assembleInstructions")}</p>
            <p className="mt-1 text-xs font-bold text-[#6e4f35]">
              {t("bentoHint", {
                left: radicalMeaning(chapter.digChars[0]),
                right: radicalMeaning(chapter.digChars[1]),
              })}
            </p>

            <div className="mt-4">
              <div className="mb-2 text-sm font-bold text-[#3b2818]">
                {t("availablePieces")}
              </div>
              <div className="flex min-h-28 flex-wrap items-center gap-3 rounded-2xl border-2 border-[#d4be98] bg-[#efe2c6] p-3">
                {tray.map((p) => (
                  <ShapedRadicalTile
                    key={p.id}
                    char={p.char}
                    selected={sel?.id === p.id}
                    onClick={() => {
                      if (energy <= 0) return;
                      sfx("tap");
                      setSel(p);
                    }}
                  />
                ))}
                {tray.length === 0 && state !== "merged" && (
                  <span className="self-center text-sm text-muted-foreground">
                    {t("trayEmpty")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="btn-game btn-accent w-full py-3 text-base"
              disabled={!slots[0] || !slots[1] || state === "merged" || energy <= 0}
              onClick={check}
            >
              {t("closeLid")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/**
 * KanjiInfo Modal — styled after middle-right of game-ui-design.png ("You discovered a new kanji!")
 */
export function KanjiInfo({
  chapter,
  onClose,
  onInspectKanji,
}: {
  chapter: Chapter;
  onClose: () => void;
  onInspectKanji?: (char: string, e: ReactMouseEvent) => void;
}) {
  const t = useT();
  const lang = useLang();
  const k = chapter.kanji;
  const { strokes, loading, error, retry } = useCalligraphyStrokes(k.char);

  return (
    <Modal title={`✨ ${t("newKanji")}`} onClose={onClose} wide>
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={onInspectKanji ? (e) => onInspectKanji(k.char, e) : undefined}
            title={onInspectKanji ? `${k.char} — ${t("wordType")}` : undefined}
            className={`flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-[#6e4b2a] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] font-kanji text-7xl font-bold text-[#3b2512] shadow-md ${
              onInspectKanji ? "cursor-pointer transition-transform hover:scale-105" : ""
            }`}
          >
            {k.char}
          </div>
          {loading && <p role="status" className="text-xs">{t("loadingStrokeData")}</p>}
          {error && (
            <div role="alert" className="text-xs text-destructive">
              <p>{t("strokeDataLoadError")}</p>
              <button className="btn-game btn-ghost mt-1 text-xs" onClick={retry}>
                {t("retry")}
              </button>
            </div>
          )}
          {!loading && !error && <StrokeDemo strokes={strokes} size={130} />}
          <span className="text-xs font-bold text-[#6e4f35]">
            {t("strokeOrder", { n: k.strokes })}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-kanji text-5xl font-bold text-[#3b2818]">{k.char}</span>
              <span className="font-display text-2xl font-bold text-[#4b8b55]">
                {pick(k.meaning, lang)}
              </span>
            </div>
            <div className="mt-1 text-sm text-[#5c3e26]">
              <b>{t("on")}</b> {k.on} · <b>{t("kun")}</b> {k.kun}
            </div>
            <div className="mt-1 text-sm font-bold text-[#3b2818]">
              {t("builtFrom")} <span className="font-kanji text-lg">{k.parts.join(" + ")}</span> (
              {k.parts
                .map((p) => (RADICALS[p] ? pick(RADICALS[p].meaning, lang) : ""))
                .join(" + ")}
              )
            </div>
          </div>

          <p className="rounded-xl border border-[#d4be98] bg-[#f8efe0] p-2.5 text-sm italic text-[#5c3e26]">
            {pick(k.story, lang)}
          </p>

          <ul className="grid gap-1.5 sm:grid-cols-3">
            {k.vocab.map((v) => (
              <li
                key={v.jp}
                onClick={onInspectKanji ? (e) => onInspectKanji(k.char, e) : undefined}
                title={onInspectKanji ? `${k.char} — ${t("wordType")}` : undefined}
                className={`flex flex-col rounded-xl border border-[#c8b28e] bg-[#fbf5e6] px-3 py-1.5 ${
                  onInspectKanji ? "cursor-pointer transition hover:border-[#4b8b55]" : ""
                }`}
              >
                <span className="font-kanji text-lg font-bold text-[#3b2818]">
                  {lang === "ja" && isFuriganaEnabled() ? (
                    <Furigana text={v.jp} kana={v.kana} className="furigana" />
                  ) : (
                    v.jp
                  )}
                </span>
                <span className="text-xs text-[#6e4f35]">{v.kana}</span>
                <span className="text-xs font-bold text-[#4b8b55]">{pick(v.en, lang)}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-3 border-[#2e5936] bg-gradient-to-b from-[#559a60] to-[#3e7b48] py-3 font-display text-lg font-bold text-white shadow-[0_4px_0_0_#264a2c] transition active:translate-y-1"
            onClick={onClose}
          >
            📖 {t("addToJournal")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * JournalModal — upgraded to match bottom-center of game-ui-design.png
 * with sidebar tabs: Kanji, Calligraphy, Vocabulary, Components, Favorites
 */
export function JournalModal({
  journal,
  discovered,
  pieces,
  onToggleFav,
  onPracticeKanji,
  onInspectKanji,
  onClose,
}: {
  journal: Writing[];
  discovered: string[];
  pieces: Piece[];
  onToggleFav: (id: string) => void;
  onPracticeKanji?: () => void;
  onInspectKanji?: (char: string, e: ReactMouseEvent) => void;
  onClose: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [tab, setTab] = useState<"kanji" | "calligraphy" | "vocab" | "components" | "favorites">(
    "kanji",
  );
  const [selectedKanji, setSelectedKanji] = useState<string>(
    discovered[0] ?? CHAPTERS[0]!.kanji.char,
  );

  const activeChapter =
    CHAPTERS.find((c) => c.kanji.char === selectedKanji) ?? CHAPTERS[0]!;
  const radicalMeaning = (c: string) =>
    RADICALS[c] ? pick(RADICALS[c].meaning, lang) : "";

  return (
    <Modal title={`📖 ${t("journalTitle")}`} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        {/* Left Sidebar Tabs matching game-ui-design.png */}
        <div className="flex flex-row flex-wrap gap-1.5 md:flex-col">
          {(
            [
              ["kanji", "🈶", "Kanji"],
              ["calligraphy", "🖌", t("calligraphy")],
              ["vocab", "💬", t("vocabTab")],
              ["components", "🧩", t("componentsTab")],
              ["favorites", "⭐", t("favorites")],
            ] as const
          ).map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                sfx("tap");
                setTab(id);
              }}
              className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition ${
                tab === id
                  ? "bg-[#4b8b55] text-white shadow-sm"
                  : "bg-[#ecd9b4] text-[#3b2818] hover:bg-[#e1c89b]"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="rounded-2xl border-2 border-[#c8b28e] bg-[#fbf5e6] p-4">
          {tab === "kanji" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {CHAPTERS.map((ch) => {
                  const unlocked = discovered.includes(ch.kanji.char);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        sfx("tap");
                        setSelectedKanji(ch.kanji.char);
                      }}
                      className={`tile h-12 w-12 text-2xl transition ${
                        selectedKanji === ch.kanji.char ? "ring-3 ring-[#4b8b55]" : ""
                      } ${unlocked ? "" : "opacity-50"}`}
                    >
                      {ch.kanji.char}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="font-kanji text-6xl font-bold text-[#3b2818]">
                      {activeChapter.kanji.char}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#6e4f35]">
                        {activeChapter.kanji.on} · {activeChapter.kanji.kun}
                      </div>
                      <div className="font-display text-2xl font-bold text-[#3b2818]">
                        {pick(activeChapter.kanji.meaning, lang)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 text-xs font-bold uppercase text-[#6e4f35]">
                      {t("componentsTab")}
                    </div>
                    <div className="flex items-center gap-2">
                      <ShapedRadicalTile char={activeChapter.digChars[0]} compact />
                      <span className="font-display text-xl font-bold text-[#5c3e26]">+</span>
                      <ShapedRadicalTile char={activeChapter.digChars[1]} compact />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-2">
                  <MemoryScene scene={activeChapter.scene} />
                  {onPracticeKanji && (
                    <button
                      type="button"
                      onClick={onPracticeKanji}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4b8b55] py-2 font-bold text-white shadow-sm hover:bg-[#3f7848]"
                    >
                      📖 {t("practiceBtn")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "calligraphy" && (
            <div>
              <h3 className="mb-3 font-bold text-wood">{t("calligraphy")}</h3>
              {journal.length === 0 ? (
                <p className="text-muted-foreground">{t("noWritings")}</p>
              ) : (
                <JournalStrip journal={journal} onToggleFav={onToggleFav} />
              )}
            </div>
          )}

          {tab === "vocab" && (
            <div className="grid gap-2 sm:grid-cols-2">
              {CHAPTERS.flatMap((ch) =>
                ch.kanji.vocab.map((v) => (
                  <div
                    key={v.jp}
                    onClick={
                      onInspectKanji ? (e) => onInspectKanji(ch.kanji.char, e) : undefined
                    }
                    title={onInspectKanji ? `${ch.kanji.char} — ${t("wordType")}` : undefined}
                    className={`flex items-center justify-between rounded-xl border border-[#d4be98] bg-[#f6ebd4] px-3 py-2 ${
                      onInspectKanji ? "cursor-pointer transition hover:border-[#4b8b55]" : ""
                    }`}
                  >
                    <div>
                      <div className="font-kanji text-lg font-bold text-[#3b2818]">{v.jp}</div>
                      <div className="text-xs text-[#6e4f35]">{v.kana}</div>
                    </div>
                    <div className="text-sm font-bold text-[#4b8b55]">{pick(v.en, lang)}</div>
                  </div>
                )),
              )}
            </div>
          )}

          {tab === "components" && (
            <div>
              <h3 className="mb-3 font-bold text-wood">{t("radicalPouch")}</h3>
              {pieces.length === 0 ? (
                <p className="text-muted-foreground">{t("emptyGoDig")}</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {pieces.map((p) => (
                    <div key={p.id} className="flex flex-col items-center gap-1">
                      <ShapedRadicalTile char={p.char} compact />
                      <span className="text-[11px] font-bold text-[#5c3e26]">
                        {radicalMeaning(p.char)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "favorites" && (
            <div>
              <h3 className="mb-3 font-bold text-wood">{t("favorites")}</h3>
              {journal.filter((w) => w.favorite).length === 0 ? (
                <p className="text-muted-foreground">{t("noWritings")}</p>
              ) : (
                <JournalStrip
                  journal={journal.filter((w) => w.favorite)}
                  onToggleFav={onToggleFav}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

/** World Map Modal styled after new-design/image 12.svg for switching between Village & Mine. */
export function WorldMapModal({
  currentMap,
  onSelectMap,
  onClose,
}: {
  currentMap: MapName;
  onSelectMap: (map: MapName) => void;
  onClose: () => void;
}) {
  const t = useT();
  return (
    <Modal title={`🗺 ${t("mapBtn")} · Kotoba Forest`} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Map 1: Mochi Village */}
        <button
          type="button"
          onClick={() => {
            onSelectMap("village");
            onClose();
          }}
          className={`group overflow-hidden rounded-2xl border-4 p-2 text-left transition hover:scale-[1.01] ${
            currentMap === "village"
              ? "border-[#4b8b55] bg-[#e6f2e3]"
              : "border-[#6e4b2a] bg-[#fbf5e6]"
          }`}
        >
          <div className="relative h-44 w-full overflow-hidden rounded-xl border-2 border-[#6e4b2a]">
            <img src={mapImg} alt={t("mochiVillage")} className="h-full w-full object-cover" />
            {currentMap === "village" && (
              <span className="absolute right-2 top-2 rounded-full bg-[#4b8b55] px-2.5 py-0.5 text-xs font-bold text-white shadow">
                ● Current Location
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <div>
              <div className="font-display text-lg font-bold text-[#3b2818]">
                🏡 {t("mochiVillage")}
              </div>
              <div className="text-xs text-[#6e4f35]">
                {t("greatKanjiTree")} · {t("pictureForest")} · {t("calligraphyDojo")}
              </div>
            </div>
            <span className="rounded-lg bg-[#ecd9b4] px-2.5 py-1 text-xs font-bold text-[#3b2818]">
              Travel →
            </span>
          </div>
        </button>

        {/* Map 2: Radical Mine */}
        <button
          type="button"
          onClick={() => {
            onSelectMap("mine");
            onClose();
          }}
          className={`group overflow-hidden rounded-2xl border-4 p-2 text-left transition hover:scale-[1.01] ${
            currentMap === "mine"
              ? "border-[#4b8b55] bg-[#e6f2e3]"
              : "border-[#6e4b2a] bg-[#fbf5e6]"
          }`}
        >
          <div className="relative h-44 w-full overflow-hidden rounded-xl border-2 border-[#6e4b2a]">
            <img src={mineMapImg} alt={t("radicalMine")} className="h-full w-full object-cover" />
            {currentMap === "mine" && (
              <span className="absolute right-2 top-2 rounded-full bg-[#4b8b55] px-2.5 py-0.5 text-xs font-bold text-white shadow">
                ● Current Location
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <div>
              <div className="font-display text-lg font-bold text-[#3b2818]">
                ⛏ {t("radicalMine")}
              </div>
              <div className="text-xs text-[#6e4f35]">
                Stardew-style Radical Artifact Excavation (1×3, 2×2, 1×4)
              </div>
            </div>
            <span className="rounded-lg bg-[#ecd9b4] px-2.5 py-1 text-xs font-bold text-[#3b2818]">
              Travel →
            </span>
          </div>
        </button>
      </div>
    </Modal>
  );
}

export function CatalogModal({
  level,
  onClose,
  onInspectKanji,
}: {
  level: number;
  onClose: () => void;
  onInspectKanji?: (char: string, e: ReactMouseEvent) => void;
}) {
  const t = useT();
  const lang = useLang();
  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      speechSynthesis.speak(u);
    } catch {
      /* unsupported */
    }
  };
  return (
    <Modal title={t("catalogTitle")} onClose={onClose} wide>
      <div className="grid gap-3 md:grid-cols-2">
        {CATALOG.map((c) => {
          const locked = level < c.level;
          return (
            <div
              key={c.title.en}
              className={`rounded-xl border-2 border-border bg-card p-3 ${
                locked ? "opacity-50" : ""
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold">{pick(c.title, lang)}</h3>
                <span className="rounded-full bg-muted px-2 text-xs">
                  {t("lv", { n: c.level })}
                </span>
              </div>
              {locked ? (
                <p className="text-muted-foreground">{t("reachLevel", { n: c.level })}</p>
              ) : (
                c.lines.map((l) => (
                  <button
                    key={l.jp}
                    onClick={() => speak(l.jp)}
                    className="mb-1 block w-full rounded-lg px-2 py-1 text-left hover:bg-muted"
                  >
                    <span className="text-xs font-bold text-accent">{l.who}</span>
                    <div className="font-kanji text-xl">
                      <ClickableKanjiText
                        jp={l.jp}
                        kana={l.kana}
                        enableFurigana={lang === "ja" && isFuriganaEnabled()}
                        onInspect={onInspectKanji}
                      />{" "}
                      <span className="text-sm">🔊</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {l.romaji} — {pick(l.en, lang)}
                    </div>
                  </button>
                ))
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
