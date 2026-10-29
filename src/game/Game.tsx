import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import tanukiImg from "@/assets/tanuki.png";
import mapIconSvg from "@/assets/new-design/map-icon.svg";
import journalIconSvg from "@/assets/new-design/image 6.svg";
import settingsIconSvg from "@/assets/new-design/settings-icon.svg";
import pouchBtnSvg from "@/assets/new-design/pouch.svg";
import friendsBtnSvg from "@/assets/new-design/image 10.svg";
import AvatarBar from "@/components/AvatarBar";
import SocialDrawer from "@/components/SocialDrawer";
import SettingsModal from "@/components/SettingsModal";
import {
  BOUNDS,
  CHAPTERS,
  MINE_STATIONS,
  OBSTACLES,
  STATIONS,
  WORLD,
  atLeast,
  lookupKanji,
  type MineStationId,
  type StationId,
} from "./data";
import { sfx, useGame } from "./store";
import { pick, useLang, useT } from "./i18n";
import {
  BentoModal,
  Calligraphy,
  CatalogModal,
  Dialogue,
  JournalModal,
  KanjiInfo,
  ShrineModal,
  WorldMapModal,
} from "./Modals";
import { PouchModal } from "./components/PouchModal";
import { AssessmentModal } from "./components/AssessmentModal";
import { KanjiPopup } from "./components/KanjiPopup";
import { KanjiTreeModal } from "./components/KanjiTreeModal";
import { VillageMap } from "./maps/VillageMap";
import { MineMap } from "./maps/MineMap";

type Overlay =
  | null
  | { kind: "dialogue"; id: string }
  | {
      kind:
        | "tree"
        | "shrine"
        | "bento"
        | "info"
        | "desk"
        | "journal"
        | "catalog"
        | "pouch"
        | "map"
        | "settings";
    };

const SPEED = 280;

export default function Game() {
  const { state, update, resetChapter, changeMap, deductEnergy, restoreEnergy, selectChapter } =
    useGame();
  const lang = useLang();
  const t = useT();
  const [pos, setPos] = useState({ x: 960, y: 560 });
  const [facing, setFacing] = useState(1);
  const [moving, setMoving] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [socialOpen, setSocialOpen] = useState(false);
  const [hurtFlash, setHurtFlash] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [inspect, setInspect] = useState<{ char: string; x: number; y: number } | null>(null);
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  const keys = useRef(new Set<string>());
  const posRef = useRef(pos);
  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;
  const inspectRef = useRef(inspect);
  inspectRef.current = inspect;

  const chapter =
    CHAPTERS[Math.min(Math.max(state.chapter, 0), CHAPTERS.length - 1)] ?? CHAPTERS[0]!;
  const chapterRef = useRef(chapter);
  chapterRef.current = chapter;

  useEffect(() => {
    const r = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  /** Phase 3: Deduct 1 energy and trigger shake + red flash feedback. */
  const handleWrongAnswer = () => {
    deductEnergy(1);
    setHurtFlash(true);
    showToast(t("wrongRadicalPenalty"));
    setTimeout(() => setHurtFlash(false), 650);
  };

  /** Opens/closes the kanji lookup popup (J key), anchored above the player. */
  const toggleInspectRef = useRef(() => {});
  toggleInspectRef.current = () => {
    if (socialOpen) return;
    const char = chapterRef.current.kanji.char;
    // Already showing the current kanji → close; showing another → replace it.
    if (inspectRef.current?.char === char) {
      setInspect(null);
      return;
    }
    const vpw = window.innerWidth;
    const vph = window.innerHeight;
    let x: number;
    let y: number;
    if (overlayRef.current?.kind === "dialogue") {
      // While chatting, anchor the popup above the dialogue panel so it is visible.
      x = vpw / 2;
      y = vph - 260;
    } else {
      const scale = Math.max(vph / 820, vpw / WORLD.w);
      const camX = Math.max(vpw - WORLD.w * scale, Math.min(0, vpw / 2 - posRef.current.x * scale));
      const camY = Math.max(vph - WORLD.h * scale, Math.min(0, vph / 2 - posRef.current.y * scale));
      x = camX + posRef.current.x * scale;
      y = camY + posRef.current.y * scale - 36;
    }
    setInspect({ char, x, y });
  };

  /** Opens the popup anchored to a clicked kanji element (vocab lists). */
  const openInspectFromEvent = (char: string, e: ReactMouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setInspect({ char, x: r.left + r.width / 2, y: r.top });
  };

  // Nearby station on VillageMap
  const nearVillage =
    state.currentMap === "village"
      ? (Object.keys(STATIONS) as StationId[]).find((id) => {
          if (id === "rock1" || id === "rock2") return false;
          const s = STATIONS[id];
          return Math.hypot(s.x - pos.x, s.y - pos.y) < s.r;
        })
      : undefined;

  // Nearby station on MineMap
  const nearMine =
    state.currentMap === "mine"
      ? (Object.keys(MINE_STATIONS) as MineStationId[]).find((id) => {
          const s = MINE_STATIONS[id];
          return Math.hypot(s.x - pos.x, s.y - pos.y) < s.r;
        })
      : undefined;

  const interactVillage = (id: StationId | undefined) => {
    if (!id || overlayRef.current) return;
    const step = state.step;
    const ch = chapterRef.current;
    switch (id) {
      case "tree":
        sfx("tap");
        setOverlay({ kind: "tree" });
        break;
      case "mori":
        setOverlay({ kind: "dialogue", id: step });
        break;
      case "mineEntrance":
        changeMap("mine");
        break;
      case "sign":
        showToast(
          state.discovered.includes(ch.kanji.char)
            ? t("signKnown", { char: ch.kanji.char, meaning: pick(ch.kanji.meaning, lang) })
            : t("signUnknown"),
        );
        break;
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

  const interactMine = (id: MineStationId | undefined) => {
    if (!id || overlayRef.current) return;
    if (id === "villageExit") {
      changeMap("village");
    }
  };

  const interactRef = useRef(() => {
    if (state.currentMap === "village") interactVillage(nearVillage);
    else interactMine(nearMine);
  });
  interactRef.current = () => {
    if (state.currentMap === "village") interactVillage(nearVillage);
    else interactMine(nearMine);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Do not intercept typing inside chat input
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) {
        e.preventDefault();
      }
      if ((k === "e" || k === " " || k === "enter") && !overlayRef.current) {
        interactRef.current();
      }
      // Kanji lookup popup: J toggles, Escape closes (works in dialogues/catalog too).
      if (k === "j" && !e.repeat) {
        toggleInspectRef.current();
      }
      if (k === "escape") {
        setInspect(null);
      }
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
    const tick = (tNow: number) => {
      const dt = Math.min(0.05, (tNow - last) / 1000);
      last = tNow;
      const k = keys.current;
      let dx = 0,
        dy = 0;
      if (!overlayRef.current && !socialOpen && !state.isTransitioning) {
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
        const blocked = (px: number, py: number) =>
          state.currentMap === "village" &&
          OBSTACLES.some(([ox, oy, r]) => Math.hypot(px - ox, py - oy) < r + 22);
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
  }, [socialOpen, state.currentMap, state.isTransitioning]);

  // First-arrival walk hint
  const greeted = useRef(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!greeted.current && state.step === "arrival" && state.assessed) {
      greeted.current = true;
      timer = setTimeout(() => showToast(t("walkHint")), 600);
    }
    return () => clearTimeout(timer);
  }, [state.step, state.assessed]);

  // Camera follow
  const scale = Math.max(vp.h / 820, vp.w / WORLD.w);
  const camX = Math.max(vp.w - WORLD.w * scale, Math.min(0, vp.w / 2 - pos.x * scale));
  const camY = Math.max(vp.h - WORLD.h * scale, Math.min(0, vp.h / 2 - pos.y * scale));

  const closeDialogue = (id: string) => {
    setOverlay(null);
    if (id === "arrival") {
      update((g) => ({ ...g, step: "mine" }));
      // Automatically travel to the Radical Mine or let player walk there
      changeMap("mine");
    }
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
        energy: g.maxEnergy,
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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Phase 3 Damage Flash Overlay */}
      <div
        className={`pointer-events-none fixed inset-0 z-45 bg-red-600/25 transition-opacity duration-300 ${
          hurtFlash ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Phase 2: Dual Map Rendering */}
      {state.currentMap === "village" ? (
        <VillageMap
          chapter={chapter}
          pos={pos}
          facing={facing}
          moving={moving}
          scale={scale}
          camX={camX}
          camY={camY}
          near={nearVillage}
          hasOverlay={!!overlay}
          popups={popups}
          onInteract={(id) => interactVillage(id)}
        />
      ) : (
        <MineMap
          chapter={chapter}
          pos={pos}
          facing={facing}
          moving={moving}
          scale={scale}
          camX={camX}
          camY={camY}
          nearMineStation={nearMine}
          onShowToast={showToast}
          onAllRequiredDug={() => {
            changeMap("village");
            setTimeout(() => setOverlay({ kind: "dialogue", id: "shrine" }), 950);
          }}
        />
      )}

      {/* HUD Top Bar: AvatarBar (Top-Left) + Quick Access Icons (Top-Right) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3">
        {/* Top-Left: Avatar & Energy Bar */}
        <AvatarBar
          level={state.level}
          energy={state.energy}
          maxEnergy={state.maxEnergy}
          discoveredCount={state.discovered.length}
          hurt={hurtFlash}
          onClick={() => {
            sfx("tap");
            if (state.energy < state.maxEnergy) {
              restoreEnergy();
              showToast(t("restAndRecover"));
            } else {
              setOverlay({ kind: "journal" });
            }
          }}
        />

        {/* Top-Right Quick Access Buttons (Map, Journal, Settings) matching game-ui-design.png */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            title={t("mapBtn")}
            onClick={() => {
              sfx("tap");
              setOverlay({ kind: "map" });
            }}
            className="h-14 w-14 transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={mapIconSvg}
              alt={t("mapBtn")}
              className="h-full w-full object-contain drop-shadow-md"
              draggable={false}
            />
          </button>

          <button
            type="button"
            title={t("journal")}
            onClick={() => {
              sfx("tap");
              setOverlay({ kind: "journal" });
            }}
            className="h-14 w-14 transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={journalIconSvg}
              alt={t("journal")}
              className="h-full w-full object-contain drop-shadow-md"
              draggable={false}
            />
          </button>

          <button
            type="button"
            title={t("settings")}
            onClick={() => {
              sfx("tap");
              setOverlay({ kind: "settings" });
            }}
            className="h-14 w-14 transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={settingsIconSvg}
              alt={t("settings")}
              className="h-full w-full object-contain drop-shadow-md"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* Left HUD Stack: Pouch Button + Friends Button (Phase 4) */}
      <div className="pointer-events-none absolute left-3 top-28 z-30 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            sfx("tap");
            setOverlay({ kind: "pouch" });
          }}
          className="pointer-events-auto relative h-14 w-36 transition-transform hover:scale-105 active:scale-95"
        >
          <img
            src={pouchBtnSvg}
            alt={t("pouch")}
            className="h-full w-full object-contain drop-shadow-md"
            draggable={false}
          />
          {state.pieces.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#3b2818] bg-[#4b8b55] px-1.5 text-xs font-extrabold text-white shadow">
              {state.pieces.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            sfx("tap");
            setSocialOpen(true);
          }}
          className="pointer-events-auto relative h-14 w-36 transition-transform hover:scale-105 active:scale-95"
        >
          <img
            src={friendsBtnSvg}
            alt={t("friendsBtn")}
            className="h-full w-full object-contain drop-shadow-md"
            draggable={false}
          />
        </button>
      </div>

      {/* Bottom-Left Objective Banner matching game-ui-design.png */}
      <div className="pointer-events-auto absolute bottom-3 left-3 z-30 max-w-sm rounded-2xl border-4 border-[#6e4b2a] bg-[#f6ebd4]/95 px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#6e4f35]">
            {t("chapterLabel", { num: chapter.num, title: pick(chapter.title, lang) })}
          </div>
        </div>
        <div className="mt-0.5 font-display text-sm font-bold text-[#3b2818] sm:text-base">
          {pick(chapter.objectives[state.step], lang)}
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="absolute bottom-24 left-4 z-30 grid grid-cols-3 gap-1 md:hidden">
        {[
          ["", ""],
          ["w", "▲"],
          ["", ""],
          ["a", "◀"],
          ["", ""],
          ["d", "▶"],
          ["", ""],
          ["s", "▼"],
          ["", ""],
        ].map(([k, l], i) =>
          k ? (
            <button
              key={i}
              className="btn-game btn-ghost h-12 w-12 p-0"
              onPointerDown={() => keys.current.add(k)}
              onPointerUp={() => keys.current.delete(k)}
              onPointerLeave={() => keys.current.delete(k)}
            >
              {l}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>

      {/* Action / Travel Quick Bar (Bottom-Right) */}
      <div className="pointer-events-auto absolute bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => changeMap(state.currentMap === "village" ? "mine" : "village")}
          className="btn-game border-2 border-[#5c3e26] bg-[#ecd9b4] px-4 py-2 text-sm text-[#3b2818]"
        >
          {state.currentMap === "village"
            ? `⛏ ${t("radicalMine")}`
            : `🏡 ${t("mochiVillage")}`}
        </button>

        <button
          className="btn-game btn-accent h-16 w-16 rounded-full text-sm shadow-lg"
          disabled={(!nearVillage && !nearMine) || !!overlay}
          onClick={() => interactRef.current()}
        >
          {nearVillage
            ? pick(STATIONS[nearVillage].label, lang)
            : nearMine
              ? pick(MINE_STATIONS[nearMine].label, lang)
              : "•"}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="panel animate-pop absolute left-1/2 top-24 z-50 -translate-x-1/2 border-3 border-[#6e4b2a] bg-[#f7eed9] px-5 py-2 font-bold text-[#3b2818]">
          {toast}
        </div>
      )}

      {/* New-Game Japanese Level Assessment Modal */}
      {!state.assessed && (
        <AssessmentModal
          onSelectChapter={(chapterIndex, discoveredKanji) => {
            update((g) => ({
              ...g,
              chapter: chapterIndex,
              discovered: [...new Set([...g.discovered, ...discoveredKanji])],
              assessed: true,
              step: "arrival",
            }));
          }}
        />
      )}

      {/* Overlays & Modals */}
      {overlay?.kind === "tree" && (
        <KanjiTreeModal
          currentChapterIndex={state.chapter}
          currentStep={state.step}
          playerLevel={state.level}
          energy={state.energy}
          maxEnergy={state.maxEnergy}
          discovered={state.discovered}
          journal={state.journal}
          onSelectChapter={(idx) => {
            selectChapter(idx);
            const targetChap = CHAPTERS[idx];
            if (targetChap) {
              showToast(
                t("chapterLabel", {
                  num: targetChap.num,
                  title: pick(targetChap.title, lang),
                }),
              );
            }
          }}
          onQuickStepAction={(step) => {
            switch (step) {
              case "arrival":
              case "restore":
                setOverlay({ kind: "dialogue", id: step });
                break;
              case "mine":
                setOverlay(null);
                changeMap("mine");
                break;
              case "shrine":
                setOverlay({ kind: "shrine" });
                break;
              case "bento":
                setOverlay({ kind: "bento" });
                break;
              case "write":
                setOverlay({ kind: "desk" });
                break;
            }
          }}
          onRestoreEnergy={() => {
            restoreEnergy();
            showToast(t("restAndRecover"));
          }}
          onPracticeKanji={(idx) => {
            if (idx !== state.chapter) selectChapter(idx);
            setOverlay({ kind: "desk" });
          }}
          onInspectKanji={openInspectFromEvent}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.kind === "dialogue" && (
        <Dialogue
          key={`${chapter.id}:${overlay.id}`}
          lines={chapter.dialogues[overlay.id] ?? []}
          onDone={() => closeDialogue(overlay.id)}
          onInspectKanji={openInspectFromEvent}
          onAdvance={() => setInspect(null)}
        />
      )}
      {overlay?.kind === "shrine" && (
        <ShrineModal
          chapter={chapter}
          pieces={state.pieces}
          energy={state.energy}
          onWrongAnswer={handleWrongAnswer}
          onRestoreEnergy={restoreEnergy}
          onClose={() => setOverlay(null)}
          onSolve={() => {
            update((g) => ({ ...g, step: g.step === "shrine" ? "bento" : g.step }));
            setOverlay({ kind: "dialogue", id: "bento" });
          }}
        />
      )}
      {overlay?.kind === "bento" && (
        <BentoModal
          chapter={chapter}
          pieces={state.pieces}
          energy={state.energy}
          onWrongAnswer={handleWrongAnswer}
          onRestoreEnergy={restoreEnergy}
          onClose={() => setOverlay(null)}
          onSolve={() => {
            update((g) => ({
              ...g,
              step: "write",
              discovered: [...new Set([...g.discovered, chapter.kanji.char])],
            }));
            setOverlay({ kind: "info" });
          }}
        />
      )}
      {overlay?.kind === "info" && (
        <KanjiInfo
          chapter={chapter}
          onInspectKanji={openInspectFromEvent}
          onClose={() =>
            setOverlay(
              state.step === "write" && state.journal.length === 0
                ? { kind: "dialogue", id: "write" }
                : null,
            )
          }
        />
      )}
      {overlay?.kind === "desk" && (
        <Calligraphy
          chapter={chapter}
          journal={state.journal}
          onToggleFav={(id) =>
            update((g) => ({
              ...g,
              journal: g.journal.map((w) =>
                w.id === id ? { ...w, favorite: !w.favorite } : w,
              ),
            }))
          }
          onSave={(image, favorite) =>
            update((g) => ({
              ...g,
              step: g.step === "write" ? "restore" : g.step,
              journal: [
                ...g.journal,
                {
                  id: String(Date.now()),
                  kanji: chapter.kanji.char,
                  image,
                  favorite,
                  date: new Date().toISOString(),
                },
              ],
            }))
          }
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.kind === "journal" && (
        <JournalModal
          journal={state.journal}
          discovered={state.discovered}
          pieces={state.pieces}
          onClose={() => setOverlay(null)}
          onPracticeKanji={() => setOverlay({ kind: "desk" })}
          onInspectKanji={openInspectFromEvent}
          onToggleFav={(id) =>
            update((g) => ({
              ...g,
              journal: g.journal.map((w) =>
                w.id === id ? { ...w, favorite: !w.favorite } : w,
              ),
            }))
          }
        />
      )}
      {overlay?.kind === "pouch" && (
        <PouchModal
          pieces={state.pieces}
          discovered={state.discovered}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.kind === "map" && (
        <WorldMapModal
          currentMap={state.currentMap}
          onSelectMap={(m) => changeMap(m)}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.kind === "settings" && (
        <SettingsModal onClose={() => setOverlay(null)} />
      )}
      {overlay?.kind === "catalog" && (
        <CatalogModal
          level={state.level}
          onClose={() => setOverlay(null)}
          onInspectKanji={openInspectFromEvent}
        />
      )}

      {/* Phase 4: Social Drawer (Friends, Ranking & Chat) */}
      <SocialDrawer
        open={socialOpen}
        onOpenChange={setSocialOpen}
        playerLevel={state.level}
        discoveredCount={state.discovered.length}
      />

      {/* Kanji Word-Type Lookup Popup (click a kanji or press J) */}
      {inspect && (
        <KanjiPopup
          kanji={lookupKanji(inspect.char)}
          x={inspect.x}
          y={inspect.y}
          onClose={() => setInspect(null)}
        />
      )}

      {/* Phase 1: Full-Screen Dark Splash Transition Overlay */}
      <div
        aria-hidden={!state.isTransitioning}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-center transition-opacity duration-500 ${
          state.isTransitioning
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mb-2 text-4xl">
          {state.currentMap === "village" ? "⛏" : "🌳"}
        </div>
        <div className="font-display text-3xl tracking-widest text-[#f3dfb9] sm:text-4xl">
          {state.currentMap === "village" ? t("radicalMine") : t("mochiVillage")}
        </div>
        <p className="mt-2 max-w-md px-4 font-kanji text-base italic text-[#f3dfb9]/80">
          {state.currentMap === "village"
            ? "Where ancient radical fragments sleep beneath the roots…"
            : "Where the Great Kanji Tree watches over Kotoba Forest…"}
        </p>
      </div>

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
