import { useEffect, useRef, useState } from "react";
import mapImg from "@/assets/map.jpg";
import tanukiImg from "@/assets/tanuki.png";
import moriImg from "@/assets/mori.png";
import treeImg from "@/assets/tree.png";
import rockImg from "@/assets/rock.png";
import shrineImg from "@/assets/shrine.png";
import bentoImg from "@/assets/bento.png";
import deskImg from "@/assets/desk.png";
import benchImg from "@/assets/bench.png";
import { BOUNDS, CHAPTERS, OBSTACLES, STATIONS, WORLD, atLeast, type StationId } from "./data";
import { sfx, useGame } from "./store";
import { pick, useLang, useT } from "./i18n";
import { BentoModal, Calligraphy, CatalogModal, Dialogue, JournalModal, KanjiInfo, ShrineModal } from "./Modals";
import SettingsModal from "@/components/SettingsModal";

type Overlay = null | { kind: "dialogue"; id: string } | { kind: "shrine" | "bento" | "info" | "desk" | "journal" | "catalog" | "settings" };

const SPEED = 280;

export default function Game() {
  const { state, update, resetChapter } = useGame();
  const lang = useLang();
  const t = useT();
  const [pos, setPos] = useState({ x: 960, y: 560 });
  const [facing, setFacing] = useState(1);
  const [moving, setMoving] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [hit, setHit] = useState<string | null>(null);
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  const keys = useRef(new Set<string>());
  const posRef = useRef(pos);
  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;

  const chapter = CHAPTERS[Math.min(Math.max(state.chapter, 0), CHAPTERS.length - 1)] ?? CHAPTERS[0]!;
  const chapterRef = useRef(chapter);
  chapterRef.current = chapter;

  useEffect(() => {
    const r = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  // nearby station
  const near = (Object.keys(STATIONS) as StationId[]).find((id) => {
    const s = STATIONS[id];
    if ((id === "rock1" || id === "rock2") && state.rocks[id] <= 0) return false;
    return Math.hypot(s.x - pos.x, s.y - pos.y) < s.r;
  });

  const interact = (id: StationId | undefined) => {
    if (!id || overlayRef.current) return;
    const step = state.step;
    const ch = chapterRef.current;
    switch (id) {
      case "mori":
        setOverlay({ kind: "dialogue", id: step });
        break;
      case "sign":
        showToast(
          state.discovered.includes(ch.kanji.char)
            ? t("signKnown", { char: ch.kanji.char, meaning: pick(ch.kanji.meaning, lang) })
            : t("signUnknown"),
        );
        break;
      case "rock1":
      case "rock2": {
        if (!atLeast(step, "mine")) return showToast(t("glowingRock"));
        sfx("dig");
        setHit(id);
        setTimeout(() => setHit(null), 300);
        const left = state.rocks[id] - 1;
        const char = id === "rock1" ? ch.digChars[0] : ch.digChars[1];
        const s = STATIONS[id];
        if (left <= 0) {
          sfx("good");
          setPopups((p) => [...p, { id: Date.now(), x: s.x, y: s.y - 60, text: char }]);
          showToast(t("foundPiece", { char }));
        }
        update((g) => {
          const rocks = { ...g.rocks, [id]: left };
          const pieces = left <= 0 ? [...g.pieces, { id: `${id}_${char}`, char }] : g.pieces;
          const done = rocks.rock1 <= 0 && rocks.rock2 <= 0;
          return { ...g, rocks, pieces, step: done && g.step === "mine" ? "shrine" : g.step };
        });
        if (left <= 0 && state.rocks[id === "rock1" ? "rock2" : "rock1"] <= 0) {
          setTimeout(() => setOverlay({ kind: "dialogue", id: "shrine" }), 900);
        }
        break;
      }
      case "shrine":
        if (!atLeast(step, "shrine")) return showToast(t("sealedCard"));
        setOverlay({ kind: "shrine" });
        break;
      case "bento":
        if (!atLeast(step, "bento")) return showToast(t("bentoEmpty"));
        if (atLeast(step, "write")) return setOverlay({ kind: "info" });
        setOverlay({ kind: "bento" });
        break;
      case "desk":
        if (!atLeast(step, "write")) return showToast(t("inkDry"));
        setOverlay({ kind: "desk" });
        break;
    }
  };

  const interactRef = useRef(interact);
  interactRef.current = interact;
  const nearRef = useRef(near);
  nearRef.current = near;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      if ((k === "e" || k === " " || k === "enter") && !overlayRef.current) interactRef.current(nearRef.current);
      keys.current.add(k);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const k = keys.current;
      let dx = 0, dy = 0;
      if (!overlayRef.current) {
        if (k.has("arrowleft") || k.has("a")) dx -= 1;
        if (k.has("arrowright") || k.has("d")) dx += 1;
        if (k.has("arrowup") || k.has("w")) dy -= 1;
        if (k.has("arrowdown") || k.has("s")) dy += 1;
      }
      if (dx || dy) {
        const len = Math.hypot(dx, dy);
        let { x, y } = posRef.current;
        const nx = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, x + (dx / len) * SPEED * dt));
        const ny = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, y + (dy / len) * SPEED * dt));
        const blocked = (px: number, py: number) => OBSTACLES.some(([ox, oy, r]) => Math.hypot(px - ox, py - oy) < r + 22);
        if (!blocked(nx, y)) x = nx;
        if (!blocked(x, ny)) y = ny;
        posRef.current = { x, y };
        setPos(posRef.current);
        if (dx) setFacing(dx > 0 ? 1 : -1);
        setMoving(true);
      } else setMoving(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // first-arrival dialogue
  const greeted = useRef(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!greeted.current && state.step === "arrival") {
      greeted.current = true;
      timer = setTimeout(() => showToast(t("walkHint")), 600);
    }
    return () => clearTimeout(timer);
  }, [state.step]);

  // camera
  const scale = Math.max(vp.h / 820, vp.w / WORLD.w);
  const camX = Math.max(vp.w - WORLD.w * scale, Math.min(0, vp.w / 2 - pos.x * scale));
  const camY = Math.max(vp.h - WORLD.h * scale, Math.min(0, vp.h / 2 - pos.y * scale));

  const restored = state.step === "done";
  const chapterLearned = state.discovered.includes(chapter.kanji.char);
  const isLastChapter = state.chapter >= CHAPTERS.length - 1;

  const closeDialogue = (id: string) => {
    setOverlay(null);
    if (id === "arrival") update((g) => ({ ...g, step: "mine" }));
    if (id === "restore") {
      sfx("chime");
      const nextLevel = state.level + 1;
      const nextChapter = state.chapter + 1;
      const last = nextChapter >= CHAPTERS.length;
      update((g) => ({
        ...g,
        chapter: last ? g.chapter : nextChapter,
        step: last ? "done" : "arrival",
        level: nextLevel,
        rocks: { rock1: 3, rock2: 3 },
        pieces: [],
      }));
      showToast(
        last
          ? t("levelUpAll", { level: nextLevel })
          : t("levelUpNext", { level: nextLevel, chapter: nextChapter + 1 }),
      );
      if (last) setTimeout(() => setOverlay({ kind: "catalog" }), 2400);
    }
  };

  const sprite = (src: string, x: number, y: number, w: number, extra = "", z?: number) => (
    <img src={src} alt="" draggable={false} className={`pointer-events-none absolute ${extra}`}
      style={{ left: x - w / 2, top: y - w / 2, width: w, height: w, zIndex: z ?? Math.round(y) }} />
  );

  const marker = (id: StationId, active: boolean) => {
    const s = STATIONS[id];
    return active ? (
      <div key={id} className="pointer-events-none absolute animate-bob text-4xl" style={{ left: s.x - 14, top: s.y - s.r - 30, zIndex: 2000 }}>
        <span className="drop-shadow-lg">❗</span>
      </div>
    ) : null;
  };

  const target: Partial<Record<string, StationId[]>> = {
    arrival: ["mori"], mine: ["rock1", "rock2"], shrine: ["shrine"], bento: ["bento"], write: ["desk"], restore: ["mori"],
  };
  const targets = target[state.step] ?? [];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: WORLD.w, height: WORLD.h, transform: `translate(${camX}px, ${camY}px) scale(${scale})` }}>
        <img src={mapImg} alt="Kotoba Forest clearing" className="absolute inset-0 h-full w-full" draggable={false} />

        {/* Great tree */}
        <div className={`pointer-events-none absolute rounded-full bg-glow transition-opacity duration-1000 ${restored ? "animate-glow opacity-100" : "opacity-0"}`}
          style={{ left: 960 - 260, top: 210 - 260, width: 520, height: 520, zIndex: 100 }} />
        {sprite(treeImg, 960, 200, 440, restored ? "" : "saturate-50 brightness-90", 150)}
        {restored && (
          <div className="pointer-events-none absolute animate-pop rounded-full bg-paper/90 px-3 font-kanji text-4xl text-accent shadow-[var(--shadow-soft)]" style={{ left: 1030, top: 120, zIndex: 900 }}>
            {chapter.kanji.char}
          </div>
        )}
        {restored && chapter.id === "kyu" && sprite(benchImg, 960, 400, 170, "animate-pop")}

        {/* Sign */}
        <div className="absolute flex h-16 w-24 items-center justify-center rounded-md border-4 border-wood bg-secondary font-kanji text-3xl text-ink shadow-[var(--shadow-pop)]"
          style={{ left: STATIONS.sign.x - 48, top: STATIONS.sign.y - 32, zIndex: STATIONS.sign.y }}>
          {chapterLearned ? chapter.kanji.char : "???"}
        </div>

        {sprite(moriImg, STATIONS.mori.x, STATIONS.mori.y - 20, 170, "animate-bob")}
        {(["rock1", "rock2"] as const).map((r) =>
          state.rocks[r] > 0 ? sprite(rockImg, STATIONS[r].x, STATIONS[r].y - 10, 150, `${atLeast(state.step, "mine") ? "" : "brightness-75"} ${hit === r ? "animate-shake" : ""}`) : null,
        )}
        {sprite(rockImg, 470, 830, 110, "grayscale brightness-90")}
        {sprite(shrineImg, STATIONS.shrine.x, STATIONS.shrine.y - 50, 230, atLeast(state.step, "shrine") ? "" : "saturate-50")}
        {sprite(bentoImg, STATIONS.bento.x, STATIONS.bento.y - 20, 170, atLeast(state.step, "bento") ? "" : "saturate-50 brightness-90")}
        {sprite(deskImg, STATIONS.desk.x, STATIONS.desk.y - 20, 180, atLeast(state.step, "write") ? "" : "saturate-50 brightness-90")}

        {targets.map((t) => marker(t, state.rocks[t as "rock1"] !== 0))}

        {popups.map((p) => (
          <div key={p.id} className="tile pointer-events-none absolute h-16 w-16 animate-float-up text-4xl" style={{ left: p.x - 32, top: p.y, zIndex: 3000 }}>{p.text}</div>
        ))}

        {/* Tanuki */}
        <div className="pointer-events-none absolute" style={{ left: pos.x - 55, top: pos.y - 95, width: 110, height: 110, zIndex: Math.round(pos.y) }}>
          <div className="absolute bottom-1 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-ink/25" />
          <img src={tanukiImg} alt="Tanuki" className={moving ? "animate-bob" : ""} style={{ transform: `scaleX(${facing})`, width: 110, height: 110 }} draggable={false} />
        </div>
        {near && !overlay && (
          <div className="pointer-events-none absolute rounded-full bg-card px-3 py-1 text-sm font-bold shadow-[var(--shadow-soft)]" style={{ left: pos.x - 40, top: pos.y - 130, zIndex: 3000 }}>
            [E] {pick(STATIONS[near].label, lang)}
          </div>
        )}
      </div>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3">
        <div className="panel pointer-events-auto flex items-center gap-3 px-3 py-2">
          <img src={tanukiImg} alt="" className="h-12 w-12" />
          <div>
            <div className="font-display text-lg leading-none text-wood">{t("tanuki")}</div>
            <div className="text-sm">
              {state.level === 0
                ? t("levelKnowsNone", { level: state.level })
                : t("levelKanji", { level: state.level, count: state.discovered.length })}
            </div>
          </div>
        </div>
        <div className="panel max-w-md px-4 py-2 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("chapterLabel", { num: chapter.num, title: pick(chapter.title, lang) })}</div>
          <div className="font-bold">✦ {pick(chapter.objectives[state.step], lang)}</div>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button className="btn-game btn-ghost" onClick={() => setOverlay({ kind: "journal" })}>📖 {t("journal")}</button>
          <button className="btn-game btn-ghost" disabled={state.level < 1} onClick={() => setOverlay({ kind: "catalog" })}>💬 {t("catalog")}</button>
          <button className="btn-game btn-ghost" onClick={() => setOverlay({ kind: "settings" })}>⚙ {t("settings")}</button>
          <button className="btn-game btn-ghost px-3" title={t("restartChapter")} onClick={() => { if (confirm(t("restartConfirm"))) { resetChapter(); posRef.current = { x: 960, y: 560 }; setPos(posRef.current); } }}>↺</button>
        </div>
      </div>

      {/* Pouch */}
      <div className="panel absolute bottom-3 left-3 z-30 flex items-center gap-2 px-3 py-2">
        <span className="text-sm font-bold text-wood">{t("pouch")}</span>
        {state.pieces.length === 0 ? <span className="text-sm text-muted-foreground">{t("empty")}</span> :
          state.pieces.map((p) => <div key={p.id} className="tile h-10 w-10 text-2xl">{p.char}</div>)}
      </div>

      {/* Touch controls */}
      <div className="absolute bottom-20 left-4 z-30 grid grid-cols-3 gap-1 md:hidden">
        {[["", ""], ["w", "▲"], ["", ""], ["a", "◀"], ["", ""], ["d", "▶"], ["", ""], ["s", "▼"], ["", ""]].map(([k, l], i) =>
          k ? (
            <button key={i} className="btn-game btn-ghost h-12 w-12 p-0"
              onPointerDown={() => keys.current.add(k)} onPointerUp={() => keys.current.delete(k)} onPointerLeave={() => keys.current.delete(k)}>{l}</button>
          ) : <span key={i} />,
        )}
      </div>
      <button className="btn-game btn-accent absolute bottom-6 right-6 z-30 h-20 w-20 rounded-full text-lg" disabled={!near || !!overlay} onClick={() => interact(near)}>
        {near ? pick(STATIONS[near].label, lang) : "•"}
      </button>

      {toast && (
        <div className="panel animate-pop absolute left-1/2 top-24 z-50 -translate-x-1/2 px-5 py-2 font-bold">{toast}</div>
      )}

      {overlay?.kind === "dialogue" && (
        <Dialogue key={`${chapter.id}:${overlay.id}`} lines={chapter.dialogues[overlay.id] ?? []} onDone={() => closeDialogue(overlay.id)} />
      )}
      {overlay?.kind === "shrine" && (
        <ShrineModal chapter={chapter} pieces={state.pieces} onClose={() => setOverlay(null)}
          onSolve={() => { update((g) => ({ ...g, step: g.step === "shrine" ? "bento" : g.step })); setOverlay({ kind: "dialogue", id: "bento" }); }} />
      )}
      {overlay?.kind === "bento" && (
        <BentoModal chapter={chapter} pieces={state.pieces} onClose={() => setOverlay(null)}
          onSolve={() => { update((g) => ({ ...g, step: "write", discovered: [...new Set([...g.discovered, chapter.kanji.char])] })); setOverlay({ kind: "info" }); }} />
      )}
      {overlay?.kind === "info" && (
        <KanjiInfo chapter={chapter} onClose={() => setOverlay(state.step === "write" && state.journal.length === 0 ? { kind: "dialogue", id: "write" } : null)} />
      )}
      {overlay?.kind === "desk" && (
        <Calligraphy chapter={chapter} journal={state.journal}
          onToggleFav={(id) => update((g) => ({ ...g, journal: g.journal.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w)) }))}
          onSave={(image, favorite) => update((g) => ({
            ...g,
            step: g.step === "write" ? "restore" : g.step,
            journal: [...g.journal, { id: String(Date.now()), kanji: chapter.kanji.char, image, favorite, date: new Date().toISOString() }],
          }))}
          onClose={() => setOverlay(null)} />
      )}
      {overlay?.kind === "journal" && (
        <JournalModal journal={state.journal} discovered={state.discovered} pieces={state.pieces} onClose={() => setOverlay(null)}
          onToggleFav={(id) => update((g) => ({ ...g, journal: g.journal.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w)) }))} />
      )}
      {overlay?.kind === "catalog" && <CatalogModal level={state.level} onClose={() => setOverlay(null)} />}
      {overlay?.kind === "settings" && <SettingsModal onClose={() => setOverlay(null)} />}

      {/* Portrait warning */}
      <div className="absolute inset-0 z-[60] hidden items-center justify-center bg-background p-8 text-center portrait:flex">
        <div className="panel p-6">
          <img src={tanukiImg} alt="" className="mx-auto h-24 w-24 animate-bob" />
          <p className="font-display text-2xl text-wood">{t("rotateLandscape")}</p>
        </div>
      </div>
    </div>
  );
}