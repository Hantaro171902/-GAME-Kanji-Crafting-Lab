import { useState } from "react";
import { CHAPTERS, PLACEMENT_QUIZ } from "../data";
import { pick, useLang, useT } from "../i18n";
import { sfx } from "../store";
import { Modal } from "./Modal";
import tanukiImg from "@/assets/tanuki.png";

type SelfLevel = "new" | "beginner" | "intermediate" | "advanced" | "unsure";

export function AssessmentModal({
  onSelectChapter,
}: {
  onSelectChapter: (chapterIndex: number, discoveredKanji: string[]) => void;
}) {
  const t = useT();
  const lang = useLang();
  const [stage, setStage] = useState<"welcome" | "quiz" | "result">("welcome");
  const [selfLevel, setSelfLevel] = useState<SelfLevel>("new");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleSelfPick = (lvl: SelfLevel) => {
    sfx("tap");
    setSelfLevel(lvl);
    if (lvl === "new") {
      onSelectChapter(0, []);
      return;
    }
    setStage("quiz");
  };

  const handleAnswer = (val: string | null) => {
    const q = PLACEMENT_QUIZ[qIndex]!;
    const isCorrect = val === q.correct;
    sfx(isCorrect ? "good" : "tap");
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);

    if (qIndex + 1 < PLACEMENT_QUIZ.length) {
      setQIndex(qIndex + 1);
    } else {
      setStage("result");
    }
  };

  // Determine recommended chapter based on quiz score & self-assessment
  const recommendedIndex = Math.min(
    CHAPTERS.length - 1,
    selfLevel === "advanced" && score >= 3
      ? 3
      : score >= 3
        ? 2
        : score >= 1
          ? 1
          : 0,
  );
  const recommendedChapter = CHAPTERS[recommendedIndex] ?? CHAPTERS[0]!;
  const priorDiscovered = CHAPTERS.slice(0, recommendedIndex).map((c) => c.kanji.char);

  return (
    <Modal title={`🌿 ${t("assessTitle")}`} wide>
      {stage === "welcome" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border-2 border-[#c8b28e] bg-[#f8efe0] p-4">
            <img src={tanukiImg} alt="Mochi" className="h-20 w-20 shrink-0 object-contain" />
            <div>
              <p className="text-base font-bold text-[#3b2818]">{t("assessSubtitle")}</p>
              <p className="mt-1 text-xs text-[#6e4f35]">{t("storyRecap")}</p>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {(
              [
                ["new", "🌱", t("levelNew")],
                ["beginner", "🍃", t("levelBeginner")],
                ["intermediate", "🌸", t("levelIntermediate")],
                ["advanced", "🏯", t("levelAdvanced")],
                ["unsure", "🧭", t("levelNotSure")],
              ] as const
            ).map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelfPick(id)}
                className="flex items-center gap-3 rounded-xl border-2 border-[#7b5836] bg-[#fbf5e6] px-4 py-3 text-left font-bold text-[#3b2818] shadow-xs transition hover:border-[#4b8b55] hover:bg-[#eef5eb]"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="btn-game btn-accent"
              onClick={() => {
                sfx("chime");
                onSelectChapter(0, []);
              }}
            >
              {t("startFromBeginning")}
            </button>
          </div>
        </div>
      )}

      {stage === "quiz" && (
        <div className="space-y-4">
          {(() => {
            const q = PLACEMENT_QUIZ[qIndex]!;
            return (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-[#6e4f35]">
                  <span>
                    Question {qIndex + 1} / {PLACEMENT_QUIZ.length}
                  </span>
                  <button
                    type="button"
                    className="underline hover:text-[#3b2818]"
                    onClick={() => onSelectChapter(0, [])}
                  >
                    {t("startFromBeginning")}
                  </button>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[#7b5836] bg-[#fbf5e6] p-5 text-center">
                  <div className="tile h-24 w-24 text-6xl">{q.kanji}</div>
                  <p className="text-lg font-bold text-[#3b2818]">{pick(q.prompt, lang)}</p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAnswer(opt.value)}
                      className="btn-game py-3 text-base"
                    >
                      {pick(opt.label, lang)}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="btn-game btn-ghost text-sm"
                    onClick={() => handleAnswer(null)}
                  >
                    {t("dontKnowYet")}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {stage === "result" && (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#5c3e26] bg-[#f3dfb9] font-kanji text-5xl text-[#3b2818]">
            {recommendedChapter.kanji.char}
          </div>
          <h3 className="font-display text-2xl font-bold text-[#3b2818]">
            {t("recommendTitle")}
          </h3>
          <p className="text-base text-[#5c3e26]">
            {t("recommendDesc", {
              score,
              total: PLACEMENT_QUIZ.length,
              chapter: recommendedChapter.num,
              title: pick(recommendedChapter.title, lang),
            })}
          </p>
          {recommendedIndex > 0 && (
            <div className="rounded-xl border border-[#c8b28e] bg-[#f8efe0] p-3 text-xs text-[#6e4f35]">
              {t("storyRecap")}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              className="btn-game btn-accent"
              onClick={() => {
                sfx("chime");
                onSelectChapter(recommendedIndex, priorDiscovered);
              }}
            >
              {t("acceptRecommend", { chapter: recommendedChapter.num })}
            </button>
            <button
              type="button"
              className="btn-game btn-ghost"
              onClick={() => {
                sfx("tap");
                onSelectChapter(0, []);
              }}
            >
              {t("startFromBeginning")}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
