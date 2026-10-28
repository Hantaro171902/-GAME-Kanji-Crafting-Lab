import { useEffect, useRef, useState, type ReactNode } from "react";
import { CATALOG, RADICALS, type Chapter, type Line } from "./data";
import { sfx, isFuriganaEnabled, type Piece, type Writing } from "./store";
import { pick, useLang, useT } from "./i18n";
import { Furigana } from "./Furigana";
import moriImg from "@/assets/mori.png";
import tanukiImg from "@/assets/tanuki.png";
import memoryImg from "@/assets/memory-rest.jpg";

export function Modal({ title, onClose, children, wide }: { title: string; onClose?: () => void; children: ReactNode; wide?: boolean }) {
  const t = useT();
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[2px]">
      <div className={`panel animate-pop relative max-h-full w-full overflow-auto p-5 ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-wood">{title}</h2>
          {onClose && (
            <button className="btn-game btn-ghost px-3 py-1" onClick={onClose} aria-label={t("close")}>
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

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

export function StrokeDemo({ strokes, size = 220, loop = true }: { strokes: string[]; size?: number; loop?: boolean }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!loop) return;
    const t = setInterval(() => setK((x) => x + 1), strokes.length * 700 + 1200);
    return () => clearInterval(t);
  }, [loop, strokes.length]);
  return (
    <svg key={k} viewBox="0 0 100 100" width={size} height={size} className="rounded-xl bg-paper">
      <line x1="50" y1="0" x2="50" y2="100" className="stroke-border" strokeDasharray="2 3" strokeWidth="0.6" />
      <line x1="0" y1="50" x2="100" y2="50" className="stroke-border" strokeDasharray="2 3" strokeWidth="0.6" />
      {strokes.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          className="stroke-ink"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: `draw-stroke 0.6s ease-out ${i * 0.7}s forwards` }}
        />
      ))}
    </svg>
  );
}

export function KanjiInfo({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const k = chapter.kanji;
  return (
    <Modal title={t("newKanji")} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-2">
          <StrokeDemo strokes={chapter.strokes} />
          <span className="text-sm text-muted-foreground">{t("strokeOrder", { n: k.strokes })}</span>
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

function useInk() {
  const [ink, setInk] = useState("black");
  useEffect(() => setInk(getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "black"), []);
  return ink;
}

export function Calligraphy({ chapter, onSave, onClose, journal, onToggleFav }: {
  chapter: Chapter;
  onSave: (img: string, fav: boolean) => void;
  onClose: () => void;
  journal: Writing[];
  onToggleFav: (id: string) => void;
}) {
  const t = useT();
  const strokes = chapter.strokes;
  const kanji = chapter.kanji;
  const [mode, setMode] = useState<"trace" | "free">("trace");
  const [strokeCount, setStrokeCount] = useState(0);
  const [showRef, setShowRef] = useState(true);
  const [fav, setFav] = useState(false);
  const [saved, setSaved] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const history = useRef<ImageData[]>([]);
  const ink = useInk();
  const traceDone = strokeCount >= strokes.length;

  const clear = () => {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    history.current = [];
    setStrokeCount(0);
  };
  useEffect(clear, [mode]);

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 400, ((e.clientY - r.top) / r.height) * 400] as const;
  };
  const down = (e: React.PointerEvent) => {
    const c = canvas.current!;
    const g = c.getContext("2d")!;
    history.current.push(g.getImageData(0, 0, 400, 400));
    drawing.current = true;
    c.setPointerCapture(e.pointerId);
    const [x, y] = pos(e);
    g.strokeStyle = ink;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = 22;
    g.beginPath();
    g.moveTo(x, y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const g = canvas.current!.getContext("2d")!;
    const [x, y] = pos(e);
    g.lineWidth = Math.max(10, Math.min(26, 26 - Math.hypot(e.movementX, e.movementY) * 0.6));
    g.lineTo(x, y);
    g.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setStrokeCount((s) => s + 1);
    sfx("tap");
  };
  const undo = () => {
    const last = history.current.pop();
    if (last) {
      canvas.current!.getContext("2d")!.putImageData(last, 0, 0);
      setStrokeCount((s) => Math.max(0, s - 1));
    }
  };
  const save = () => {
    onSave(canvas.current!.toDataURL("image/png"), fav);
    setSaved(true);
    sfx("chime");
  };

  const cur = Math.min(strokeCount, strokes.length - 1);

  return (
    <Modal title={t("deskTitle")} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <button className={`btn-game px-4 py-1 ${mode === "trace" ? "" : "btn-ghost"}`} onClick={() => setMode("trace")}>{t("trace")}</button>
            <button className={`btn-game px-4 py-1 ${mode === "free" ? "" : "btn-ghost"}`} disabled={!traceDone && mode === "trace"} onClick={() => setMode("free")}>{t("freeWrite")}</button>
          </div>
          <div className="relative h-[min(52vh,340px)] w-[min(52vh,340px)] rounded-xl border-4 border-wood bg-paper">
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
              <line x1="50" y1="0" x2="50" y2="100" className="stroke-border" strokeDasharray="2 3" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" className="stroke-border" strokeDasharray="2 3" strokeWidth="0.5" />
              {(mode === "trace" || showRef) &&
                strokes.map((d, i) => (
                  <path key={i} d={d} fill="none" strokeLinecap="round" strokeWidth="8"
                    className={mode === "trace" && i === cur && !traceDone ? "stroke-accent/60" : "stroke-muted-foreground/20"} />
                ))}
              {mode === "trace" && !traceDone && (() => {
                const m = (strokes[cur] ?? "").match(/M(\d+) (\d+)/) ?? ["", "0", "0"];
                return (
                  <g>
                    <circle cx={m[1]} cy={m[2]} r="4" className="fill-accent animate-glow" />
                    <text x={Number(m[1]) + 5} y={Number(m[2]) - 4} className="fill-accent font-bold" fontSize="7">{cur + 1}</text>
                  </g>
                );
              })()}
            </svg>
            <canvas
              ref={canvas}
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full touch-none"
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerLeave={up}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="btn-game btn-ghost px-3 py-1" onClick={undo}>{t("undo")}</button>
            <button className="btn-game btn-ghost px-3 py-1" onClick={clear}>{t("clear")}</button>
            {mode === "free" && (
              <button className="btn-game btn-ghost px-3 py-1" onClick={() => setShowRef((v) => !v)}>
                {showRef ? t("hideGuide") : t("showGuide")}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {mode === "trace" ? (
            <>
              <p>{t("followStroke", { cur: Math.min(strokeCount + 1, strokes.length), total: strokes.length })}</p>
              <StrokeDemo strokes={strokes} size={140} />
              {traceDone && (
                <button className="btn-game btn-accent animate-pop" onClick={() => setMode("free")}>
                  {t("greatNowWrite")}
                </button>
              )}
            </>
          ) : (
            <>
              <p>{t("writeFromMemory", { char: kanji.char, cur: strokeCount, total: strokes.length })}</p>
              <label className="flex items-center gap-2">
                <button className={`btn-game px-3 py-1 ${fav ? "btn-accent" : "btn-ghost"}`} onClick={() => setFav((f) => !f)}>
                  {fav ? t("favoriteOn") : t("favoriteOff")}
                </button>
              </label>
              <button className="btn-game" disabled={strokeCount < strokes.length || saved} onClick={save}>
                {saved ? t("savedToJournal") : t("saveToJournal")}
              </button>
              {saved && <button className="btn-game btn-accent animate-pop" onClick={onClose}>{t("returnToForest")}</button>}
            </>
          )}
          {journal.length > 0 && <JournalStrip journal={journal} onToggleFav={onToggleFav} />}
        </div>
      </div>
    </Modal>
  );
}

function JournalStrip({ journal, onToggleFav }: { journal: Writing[]; onToggleFav: (id: string) => void }) {
  const t = useT();
  return (
    <div>
      <h3 className="mb-1 font-bold text-wood">{t("memoryJournal")}</h3>
      <div className="flex flex-wrap gap-2">
        {journal.map((w) => (
          <div key={w.id} className="relative">
            <img src={w.image} alt={`Your ${w.kanji}`} className="h-20 w-20 rounded-lg border-2 border-wood bg-paper" />
            <button onClick={() => onToggleFav(w.id)} className="absolute -right-1 -top-1 rounded-full bg-card px-1 text-accent" aria-label={t("toggleFavorite")}>
              {w.favorite ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
    </div>
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