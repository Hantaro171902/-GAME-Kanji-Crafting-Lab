import { useEffect, useState } from "react";
import { CATALOG, RADICALS, type Chapter, type Line } from "./data";
import { sfx, isFuriganaEnabled, type Piece, type Writing } from "./store";
import { pick, useLang, useT } from "./i18n";
import { Furigana } from "./Furigana";
import { Modal } from "./components/Modal";
import { JournalStrip } from "./components/JournalStrip";
import { StrokeDemo } from "./features/calligraphy/StrokeDemo";
import { useCalligraphyStrokes } from "./features/calligraphy/useCalligraphyStrokes";
import moriImg from "@/assets/mori.png";
import tanukiImg from "@/assets/tanuki.png";
import memoryImg from "@/assets/memory-rest.jpg";
import timeImg from "@/assets/time.jpg";
import maleImg from "@/assets/male.jpg";
import snowImg from "@/assets/snow.jpg";

export { Modal };
export { Calligraphy } from "./features/calligraphy/Calligraphy";
export { StrokeDemo };

export function Dialogue({ lines, onDone }: { lines: Line[]; onDone: () => void }) {
  const t = useT();
  const lang = useLang();
  const [i, setI] = useState(0);
  const line = lines[i];
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "e") next();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const next = () => {
    sfx("tap");
    if (i + 1 < lines.length) setI(i + 1);
    else onDone();
  };
  if (!line) return null;
  const isMori = line.who === "mori";
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center p-4" onClick={next}>
      <div className="panel animate-pop flex w-full max-w-3xl cursor-pointer items-end gap-4 p-4">
        <img src={isMori ? moriImg : tanukiImg} alt="" className="-mt-16 h-28 w-28 shrink-0 object-contain drop-shadow-lg" />
        <div className="flex-1">
          <div className="mb-1 inline-block rounded-full bg-wood px-3 py-0.5 text-sm font-bold text-primary-foreground">
            {isMori ? t("moriTitle") : t("tanukiTitle")}
          </div>
          <p className="text-lg leading-snug">
            {lang === "ja" && isFuriganaEnabled() && line.kana
              ? <Furigana text={line.text.ja} kana={line.kana} className="furigana" />
              : pick(line.text, lang)}
          </p>
          <p className="mt-1 text-right text-sm text-muted-foreground animate-bob">{t("tapSpace")}</p>
        </div>
      </div>
    </div>
  );
}

/** Hand-painted style memory picture shown by the Picture Shrine. */
function MemoryScene({ scene }: { scene: Chapter["scene"] }) {
  if (scene === "rest") {
    return <img src={memoryImg} alt="Someone resting against a tree" className="w-full rounded-xl border-4 border-wood" />;
  }
  if (scene === "bright") {
    return (
      <svg viewBox="0 0 400 300" className="w-full rounded-xl border-4 border-wood" role="img" aria-label="The sun and the moon sharing the sky">
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
    return <img src={timeImg} alt="The sun casting a shadow beside a temple" className="w-full rounded-xl border-4 border-wood" />;
  }
  if (scene === "field") {
    return <img src={maleImg} alt="A person working in a green rice field" className="w-full rounded-xl border-4 border-wood" />;
  }
  if (scene === "snow") {
    return <img src={snowImg} alt="A snowy forest with falling snow" className="w-full rounded-xl border-4 border-wood" />;
  }
  return (
    <svg viewBox="0 0 400 300" className="w-full rounded-xl border-4 border-wood" role="img" aria-label="A mountain standing on stone">
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

export function ShrineModal({ chapter, pieces, onSolve, onClose }: { chapter: Chapter; pieces: Piece[]; onSolve: () => void; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const options = chapter.shrineOptions;
  const owned = new Set(pieces.map((p) => p.char));
  const [picked, setPicked] = useState<string[]>([]);
  const [bad, setBad] = useState(false);
  const toggle = (c: string) => {
    sfx("tap");
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  };
  const check = () => {
    const ok = picked.length === 2 && picked.includes(chapter.digChars[0]) && picked.includes(chapter.digChars[1]);
    if (ok) {
      sfx("good");
      onSolve();
    } else {
      sfx("bad");
      setBad(true);
      setTimeout(() => setBad(false), 700);
    }
  };
  return (
    <Modal title={t("shrineTitle")} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-2">
        <MemoryScene scene={chapter.scene} />
        <div className="flex flex-col gap-3">
          <p className="text-lg">{t("memoryOpens")}<b>{pick(chapter.kanji.story, lang)}</b></p>
          <p className="text-muted-foreground">{t("whichPieces")}</p>
          <div className={`grid grid-cols-2 gap-3 ${bad ? "animate-shake" : ""}`}>
            {options.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`tile h-24 flex-col text-4xl transition ${picked.includes(c) ? "ring-4 ring-success" : ""} ${owned.has(c) ? "" : "opacity-60"}`}
              >
                {c}
                <span className="font-sans text-xs text-muted-foreground">{RADICALS[c]?.meaning ? pick(RADICALS[c].meaning, lang) : ""}</span>
              </button>
            ))}
          </div>
          <button className="btn-game btn-accent mt-2" onClick={check}>
            {t("remember")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function BentoModal({ chapter, pieces, onSolve, onClose }: { chapter: Chapter; pieces: Piece[]; onSolve: () => void; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const [slots, setSlots] = useState<(Piece | null)[]>([null, null]);
  const [sel, setSel] = useState<Piece | null>(null);
  const [state, setState] = useState<"idle" | "bad" | "merged">("idle");
  const tray = pieces.filter((p) => !slots.some((s) => s?.id === p.id));
  const radicalMeaning = (c: string) => (RADICALS[c] ? pick(RADICALS[c].meaning, lang) : "");
  const place = (i: number) => {
    if (state === "merged") return;
    if (slots[i]) {
      sfx("tap");
      setSlots((s) => s.map((x, j) => (j === i ? null : x)));
      return;
    }
    if (!sel) return;
    sfx("tap");
    setSlots((s) => s.map((x, j) => (j === i ? sel : x)));
    setSel(null);
  };
  const check = () => {
    if (slots[0]?.char === chapter.digChars[0] && slots[1]?.char === chapter.digChars[1]) {
      sfx("chime");
      setState("merged");
      setTimeout(onSolve, 1400);
    } else {
      sfx("bad");
      setState("bad");
      setTimeout(() => {
        setSlots([null, null]);
        setState("idle");
      }, 700);
    }
  };
  return (
    <Modal title={t("bentoTitle")} onClose={onClose}>
      <p className="mb-4 text-muted-foreground">
        {t("bentoHint", { left: radicalMeaning(chapter.digChars[0]), right: radicalMeaning(chapter.digChars[1]) })}
      </p>
      <div className={`mx-auto mb-5 flex h-48 max-w-md overflow-hidden rounded-2xl border-[6px] border-ink bg-accent/90 p-2 shadow-[var(--shadow-soft)] ${state === "bad" ? "animate-shake" : ""}`}>
        {state === "merged" ? (
          <div className="animate-pop flex flex-1 items-center justify-center rounded-xl bg-paper font-kanji text-9xl text-ink">
            {chapter.kanji.char}
          </div>
        ) : (
          [0, 1].map((i) => (
            <button
              key={i}
              onClick={() => place(i)}
              className={`m-1 flex items-center justify-center rounded-xl border-2 border-dashed font-kanji text-7xl text-ink transition ${
                i === 0 ? "w-2/5" : "flex-1"
              } ${slots[i] ? "border-success bg-paper" : "border-paper/70 bg-paper/30"} ${sel && !slots[i] ? "animate-glow" : ""}`}
            >
              {slots[i]?.char ?? ""}
            </button>
          ))
        )}
      </div>
      <div className="mb-4 flex min-h-20 justify-center gap-3 rounded-xl bg-muted p-3">
        {tray.map((p) => (
          <button key={p.id} onClick={() => (sfx("tap"), setSel(p))} className={`tile h-16 w-16 text-4xl ${sel?.id === p.id ? "ring-4 ring-gold -translate-y-1" : ""}`}>
            {p.char}
          </button>
        ))}
        {tray.length === 0 && state !== "merged" && <span className="self-center text-muted-foreground">{t("trayEmpty")}</span>}
      </div>
      <div className="flex justify-center">
        <button className="btn-game btn-accent" disabled={!slots[0] || !slots[1] || state === "merged"} onClick={check}>
          {t("closeLid")}
        </button>
      </div>
    </Modal>
  );
}

export function KanjiInfo({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const k = chapter.kanji;
  const { strokes, loading, error, retry } = useCalligraphyStrokes(k.char);
  return (
    <Modal title={t("newKanji")} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-2">
          {loading && <p role="status">{t("loadingStrokeData")}</p>}
          {error && (
            <div role="alert" className="text-sm text-destructive">
              <p>{t("strokeDataLoadError")}</p>
              <button className="btn-game btn-ghost mt-2" onClick={retry}>
                {t("retry")}
              </button>
            </div>
          )}
          {!loading && !error && <StrokeDemo strokes={strokes} />}
          <span className="text-sm text-muted-foreground">
            {t("strokeOrder", { n: k.strokes })}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="font-kanji text-6xl">{k.char}</span>
            <span className="font-display text-3xl text-accent">{pick(k.meaning, lang)}</span>
          </div>
          <p className="italic">{pick(k.story, lang)}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-muted p-2"><b>{t("on")}</b> {k.on}</div>
            <div className="rounded-lg bg-muted p-2"><b>{t("kun")}</b> {k.kun}</div>
            <div className="col-span-2 rounded-lg bg-muted p-2"><b>{t("builtFrom")}</b> <span className="font-kanji text-lg">{k.parts.join(" + ")}</span> · {k.parts.map((p) => (RADICALS[p] ? pick(RADICALS[p].meaning, lang) : "")).join(" + ")}</div>
          </div>
          <ul className="space-y-1">
            {k.vocab.map((v) => (
              <li key={v.jp} className="flex gap-3 rounded-lg border border-border px-3 py-1">
                <span className="font-kanji text-xl">
                  {lang === "ja" && isFuriganaEnabled()
                    ? <Furigana text={v.jp} kana={v.kana} className="furigana" />
                    : v.jp}
                </span>
                {!(lang === "ja" && isFuriganaEnabled()) && <span className="text-muted-foreground">{v.kana}</span>}
                <span className="ml-auto">{pick(v.en, lang)}</span>
              </li>
            ))}
          </ul>
          <button className="btn-game w-full" onClick={onClose}>{t("backToForest")}</button>
        </div>
      </div>
    </Modal>
  );
}

export function JournalModal({ journal, discovered, pieces, onToggleFav, onClose }: {
  journal: Writing[]; discovered: string[]; pieces: Piece[]; onToggleFav: (id: string) => void; onClose: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [onlyFav, setOnlyFav] = useState(false);
  const list = onlyFav ? journal.filter((w) => w.favorite) : journal;
  const radicalMeaning = (c: string) => (RADICALS[c] ? pick(RADICALS[c].meaning, lang) : "");
  return (
    <Modal title={t("journalTitle")} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-bold text-wood">{t("radicalPouch")}</h3>
          <div className="flex flex-wrap gap-2">
            {pieces.length === 0 && <p className="text-muted-foreground">{t("emptyGoDig")}</p>}
            {pieces.map((p) => (
              <div key={p.id} className="tile h-16 w-16 flex-col text-3xl">
                {p.char}
                <span className="font-sans text-[10px]">{radicalMeaning(p.char)}</span>
              </div>
            ))}
          </div>
          <h3 className="mb-2 mt-4 font-bold text-wood">{t("kanjiLearned")}</h3>
          <div className="flex gap-2">
            {discovered.length === 0 && <p className="text-muted-foreground">{t("noneYet")}</p>}
            {discovered.map((k) => <div key={k} className="tile h-16 w-16 text-4xl">{k}</div>)}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-wood">{t("calligraphy")}</h3>
            <button className={`btn-game px-3 py-1 text-sm ${onlyFav ? "btn-accent" : "btn-ghost"}`} onClick={() => setOnlyFav((v) => !v)}>{t("favorites")}</button>
          </div>
          {list.length === 0 ? <p className="text-muted-foreground">{t("noWritings")}</p> : <JournalStrip journal={list} onToggleFav={onToggleFav} />}
        </div>
      </div>
    </Modal>
  );
}

export function CatalogModal({ level, onClose }: { level: number; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      speechSynthesis.speak(u);
    } catch { /* unsupported */ }
  };
  return (
    <Modal title={t("catalogTitle")} onClose={onClose} wide>
      <div className="grid gap-3 md:grid-cols-2">
        {CATALOG.map((c) => {
          const locked = level < c.level;
          return (
            <div key={c.title.en} className={`rounded-xl border-2 border-border bg-card p-3 ${locked ? "opacity-50" : ""}`}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold">{pick(c.title, lang)}</h3>
                <span className="rounded-full bg-muted px-2 text-xs">{t("lv", { n: c.level })}</span>
              </div>
              {locked ? (
                <p className="text-muted-foreground">{t("reachLevel", { n: c.level })}</p>
              ) : (
                c.lines.map((l) => (
                  <button key={l.jp} onClick={() => speak(l.jp)} className="mb-1 block w-full rounded-lg px-2 py-1 text-left hover:bg-muted">
                    <span className="text-xs font-bold text-accent">{l.who}</span>
                    <div className="font-kanji text-xl">
                      {lang === "ja" && isFuriganaEnabled() && l.kana
                        ? <Furigana text={l.jp} kana={l.kana} className="furigana" />
                        : l.jp}{" "}
                      <span className="text-sm">🔊</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{l.romaji} — {pick(l.en, lang)}</div>
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