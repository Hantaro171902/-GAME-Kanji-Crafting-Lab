import { useState } from "react";
import { CHAPTERS, JLPT_LEVELS, PLACEMENT_QUIZ, type JLPTLevel } from "../data";
import { pick, useLang, useT } from "../i18n";
import { sfx } from "../store";
import { Modal } from "./Modal";
import tanukiImg from "@/assets/tanuki.png";

const QUESTIONS_PER_LEVEL = 10;
const PASSING_SCORE = 7;

const initialLevelScores: Record<JLPTLevel, number> = {
  N5: 0,
  N4: 0,
  N3: 0,
};

export function AssessmentModal({
  onSelectChapter,
}: {
  onSelectChapter: (chapterIndex: number, discoveredKanji: string[]) => void;
}) {
  const t = useT();
  const lang = useLang();
  const [stage, setStage] = useState<"welcome" | "quiz" | "result">("welcome");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [levelScores, setLevelScores] = useState<Record<JLPTLevel, number>>(initialLevelScores);

  const handleAnswer = (val: string | null) => {
    const q = PLACEMENT_QUIZ[qIndex]!;
    const isCorrect = val === q.correct;
    sfx(isCorrect ? "good" : "tap");
    if (isCorrect) {
      setScore((current) => current + 1);
      setLevelScores((current) => ({
        ...current,
        [q.jlptLevel]: current[q.jlptLevel] + 1,
      }));
    }

    if (qIndex + 1 < PLACEMENT_QUIZ.length) {
      setQIndex(qIndex + 1);
    } else {
      setStage("result");
    }
  };

  const recommendedIndex = Math.min(
    CHAPTERS.length - 1,
    levelScores.N5 >= PASSING_SCORE
      ? levelScores.N4 >= PASSING_SCORE
        ? levelScores.N3 >= PASSING_SCORE
          ? 2
          : 1
        : 0
      : 0,
  );
  const recommendedChapter = CHAPTERS[recommendedIndex] ?? CHAPTERS[0]!;
  const priorDiscovered = CHAPTERS.slice(0, recommendedIndex).map((chapter) => chapter.kanji.char);
  const currentQuestion = PLACEMENT_QUIZ[qIndex];
  const currentLevelQuestionNumber = currentQuestion
    ? PLACEMENT_QUIZ.slice(0, qIndex + 1).filter(
        (question) => question.jlptLevel === currentQuestion.jlptLevel,
      ).length
    : 0;

  return (
    <Modal title={`🌿 ${t("assessTitle")}`} wide>
      {stage === "welcome" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border-2 border-[#c8b28e] bg-[#f8efe0] p-4">
            <img src={tanukiImg} alt="Mochi" className="h-20 w-20 shrink-0 object-contain" />
            <div>
              <p className="text-base font-bold text-[#3b2818]">{t("jlptTestIntro")}</p>
              <p className="mt-1 text-xs text-[#6e4f35]">{t("jlptListNote")}</p>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {JLPT_LEVELS.map((level) => (
              <div
                key={level}
                className="rounded-xl border-2 border-[#7b5836] bg-[#fbf5e6] p-4 text-center text-[#3b2818]"
              >
                <p className="font-display text-xl font-bold">{t(`jlpt${level}`)}</p>
                <p className="mt-1 text-sm">
                  {t("jlptQuestionCount", { count: QUESTIONS_PER_LEVEL })}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
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
            <button
              type="button"
              className="btn-game btn-accent"
              onClick={() => {
                sfx("chime");
                setStage("quiz");
              }}
            >
              {t("startJlptTest")}
            </button>
          </div>
        </div>
      )}

      {stage === "quiz" && currentQuestion && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#6e4f35]">
            <span>
              {t(`jlpt${currentQuestion.jlptLevel}`)}{" "}
              {t("questionProgress", {
                current: currentLevelQuestionNumber,
                total: QUESTIONS_PER_LEVEL,
              })}
            </span>
            <span>
              {t("overallProgress", { current: qIndex + 1, total: PLACEMENT_QUIZ.length })}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[#7b5836] bg-[#fbf5e6] p-5 text-center">
            <div className="tile h-24 w-24 text-6xl">{currentQuestion.kanji}</div>
            <p className="text-lg font-bold text-[#3b2818]">{pick(currentQuestion.prompt, lang)}</p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className="btn-game py-3 text-base"
              >
                {pick(option.label, lang)}
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
        </div>
      )}

      {stage === "result" && (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#5c3e26] bg-[#f3dfb9] font-kanji text-5xl text-[#3b2818]">
            {recommendedChapter.kanji.char}
          </div>
          <h3 className="font-display text-2xl font-bold text-[#3b2818]">{t("recommendTitle")}</h3>
          <p className="text-base text-[#5c3e26]">
            {t("recommendDesc", {
              score,
              total: PLACEMENT_QUIZ.length,
              chapter: recommendedChapter.num,
              title: pick(recommendedChapter.title, lang),
            })}
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {JLPT_LEVELS.map((level) => (
              <div
                key={level}
                className={`rounded-xl border p-3 text-sm font-bold ${
                  levelScores[level] >= PASSING_SCORE
                    ? "border-[#4b8b55] bg-[#eef5eb] text-[#315d38]"
                    : "border-[#c8b28e] bg-[#f8efe0] text-[#6e4f35]"
                }`}
              >
                {t(`jlpt${level}`)}: {levelScores[level]}/{QUESTIONS_PER_LEVEL}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#6e4f35]">{t("jlptPassNote", { score: PASSING_SCORE })}</p>

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
