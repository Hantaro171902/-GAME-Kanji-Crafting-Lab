import mapImg from "@/assets/map.jpg";
import tanukiImg from "@/assets/tanuki.png";
import moriImg from "@/assets/mori.png";
import treeImg from "@/assets/tree.png";
import shrineImg from "@/assets/shrine.png";
import bentoImg from "@/assets/bento.png";
import deskImg from "@/assets/desk.png";
import benchImg from "@/assets/bench.png";
import sundialImg from "@/assets/sundial.svg";
import mineEntranceImg from "@/assets/mine-entrance.png";
import { STATIONS, WORLD, atLeast, type Chapter, type StationId } from "../data";
import { pick, useLang, useT } from "../i18n";
import { useGame } from "../store";

export function VillageMap({
  chapter,
  pos,
  facing,
  moving,
  scale,
  camX,
  camY,
  near,
  hasOverlay,
  popups,
  onInteract,
}: {
  chapter: Chapter;
  pos: { x: number; y: number };
  facing: number;
  moving: boolean;
  scale: number;
  camX: number;
  camY: number;
  near: StationId | undefined;
  hasOverlay: boolean;
  popups: { id: number; x: number; y: number; text: string }[];
  onInteract: (id: StationId) => void;
}) {
  const { state, changeMap } = useGame();
  const lang = useLang();
  const t = useT();

  const restored = state.step === "done";
  const chapterLearned = state.discovered.includes(chapter.kanji.char);

  const sprite = (
    src: string,
    x: number,
    y: number,
    w: number,
    extra = "",
    z?: number,
    onClick?: () => void,
  ) => (
    <img
      src={src}
      alt=""
      draggable={false}
      onClick={onClick}
      className={`${onClick ? "pointer-events-auto cursor-pointer hover:scale-105 transition-transform" : "pointer-events-none"} absolute ${extra}`}
      style={{ left: x - w / 2, top: y - w / 2, width: w, height: w, zIndex: z ?? Math.round(y) }}
    />
  );

  const landmarkBadge = (
    icon: string,
    label: string,
    x: number,
    y: number,
    onClick?: () => void,
  ) => (
    <button
      type="button"
      onClick={onClick}
      style={{ left: x, top: y, zIndex: 1800 }}
      className="pointer-events-auto absolute -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl border-3 border-[#6e4b2a] bg-[#f5ead4]/95 px-3.5 py-1 font-display text-base font-bold text-[#3b2818] shadow-[0_4px_0_0_#5c3e26] transition hover:scale-105"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  const marker = (id: StationId, active: boolean) => {
    const s = STATIONS[id];
    return active ? (
      <div
        key={id}
        className="pointer-events-none absolute animate-bob text-4xl"
        style={{ left: s.x - 14, top: s.y - s.r - 30, zIndex: 2000 }}
      >
        <span className="drop-shadow-lg">❗</span>
      </div>
    ) : null;
  };

  const target: Partial<Record<string, StationId[]>> = {
    arrival: ["mori"],
    mine: ["mineEntrance"],
    shrine: ["shrine"],
    bento: ["bento"],
    write: ["desk"],
    restore: ["mori"],
  };
  const targets = target[state.step] ?? [];

  return (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{
        width: WORLD.w,
        height: WORLD.h,
        transform: `translate(${camX}px, ${camY}px) scale(${scale})`,
      }}
    >
      <img
        src={mapImg}
        alt="Mochi Village clearing"
        className="absolute inset-0 h-full w-full"
        draggable={false}
      />

      {/* Great Kanji Tree (Center) */}
      <div
        className={`pointer-events-none absolute rounded-full bg-glow transition-opacity duration-1000 ${
          restored ? "animate-glow opacity-100" : "opacity-0"
        }`}
        style={{ left: 960 - 260, top: 210 - 260, width: 520, height: 520, zIndex: 100 }}
      />
      {sprite(treeImg, 960, 200, 440, restored ? "" : "saturate-75 brightness-95", 150, () =>
        onInteract("mori"),
      )}
      {landmarkBadge("🌳", t("greatKanjiTree"), 1120, 145, () => onInteract("mori"))}

      {restored && (
        <div
          className="pointer-events-none absolute animate-pop rounded-full bg-paper/90 px-3 font-kanji text-4xl text-accent shadow-[var(--shadow-soft)]"
          style={{ left: 1030, top: 90, zIndex: 900 }}
        >
          {chapter.kanji.char}
        </div>
      )}
      {restored && chapter.id === "kyu" && sprite(benchImg, 960, 400, 170, "animate-pop")}
      {restored && chapter.id === "ji" && sprite(sundialImg, 704, 476, 120, "animate-pop")}

      {/* Village Sign */}
      <div
        onClick={() => onInteract("sign")}
        className="pointer-events-auto absolute flex h-16 w-24 cursor-pointer items-center justify-center rounded-md border-4 border-wood bg-secondary font-kanji text-3xl text-ink shadow-[var(--shadow-pop)] transition hover:scale-105"
        style={{
          left: STATIONS.sign.x - 48,
          top: STATIONS.sign.y - 32,
          zIndex: STATIONS.sign.y,
        }}
      >
        {chapterLearned ? chapter.kanji.char : "???"}
      </div>

      {/* Radical Mine Entrance Portal (West) */}
      {sprite(
        mineEntranceImg,
        STATIONS.mineEntrance.x,
        STATIONS.mineEntrance.y - 30,
        290,
        state.step === "mine" ? "drop-shadow-[0_0_18px_rgba(255,215,110,0.85)]" : "",
        STATIONS.mineEntrance.y,
        () => changeMap("mine"),
      )}
      {landmarkBadge("⛏", t("radicalMine"), STATIONS.mineEntrance.x - 30, STATIONS.mineEntrance.y + 85, () =>
        changeMap("mine"),
      )}

      {/* Mori (NPC Guide) & Mochi Village Banner */}
      {sprite(moriImg, STATIONS.mori.x, STATIONS.mori.y - 20, 170, "animate-bob", undefined, () =>
        onInteract("mori"),
      )}
      {landmarkBadge("🏡", t("mochiVillage"), 960, 460, () => onInteract("mori"))}

      {/* Picture Shrine (East) */}
      {sprite(
        shrineImg,
        STATIONS.shrine.x,
        STATIONS.shrine.y - 50,
        230,
        atLeast(state.step, "shrine") ? "" : "saturate-50",
        undefined,
        () => onInteract("shrine"),
      )}
      {landmarkBadge("🌲", t("pictureForest"), STATIONS.shrine.x + 20, STATIONS.shrine.y - 165, () =>
        onInteract("shrine"),
      )}

      {/* Bento Assembly Table (South-Center) */}
      {sprite(
        bentoImg,
        STATIONS.bento.x,
        STATIONS.bento.y - 20,
        170,
        atLeast(state.step, "bento") ? "" : "saturate-50 brightness-90",
        undefined,
        () => onInteract("bento"),
      )}
      {landmarkBadge("🍱", t("bentoTitle"), STATIONS.bento.x, STATIONS.bento.y + 65, () =>
        onInteract("bento"),
      )}

      {/* Calligraphy Desk / Dojo (East-North) */}
      {sprite(
        deskImg,
        STATIONS.desk.x,
        STATIONS.desk.y - 20,
        180,
        atLeast(state.step, "write") ? "" : "saturate-50 brightness-90",
        undefined,
        () => onInteract("desk"),
      )}
      {landmarkBadge("🖌", t("calligraphyDojo"), STATIONS.desk.x, STATIONS.desk.y + 70, () =>
        onInteract("desk"),
      )}

      {targets.map((targetId) => marker(targetId, true))}

      {popups.map((p) => (
        <div
          key={p.id}
          className="tile pointer-events-none absolute h-16 w-16 animate-float-up text-4xl"
          style={{ left: p.x - 32, top: p.y, zIndex: 3000 }}
        >
          {p.text}
        </div>
      ))}

      {/* Player Avatar (Mochi) */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: pos.x - 55,
          top: pos.y - 95,
          width: 110,
          height: 110,
          zIndex: Math.round(pos.y),
        }}
      >
        <div className="absolute bottom-1 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-ink/25" />
        <img
          src={tanukiImg}
          alt="Tanuki"
          className={moving ? "animate-bob" : ""}
          style={{ transform: `scaleX(${facing})`, width: 110, height: 110 }}
          draggable={false}
        />
      </div>

      {near && !hasOverlay && (
        <div
          className="pointer-events-none absolute rounded-full bg-card px-3 py-1 text-sm font-bold shadow-[var(--shadow-soft)]"
          style={{ left: pos.x - 40, top: pos.y - 130, zIndex: 3000 }}
        >
          [E] {pick(STATIONS[near].label, lang)}
        </div>
      )}
    </div>
  );
}

export default VillageMap;
