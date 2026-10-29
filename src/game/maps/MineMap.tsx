import { useMemo, useState } from "react";
import mineMapImg from "@/assets/mine-map.jpg";
import tanukiImg from "@/assets/tanuki.png";
import tanukiDigImg from "@/assets/tanuki-dig.png";
import rockImg from "@/assets/rock.png";
import digBtnSvg from "@/assets/new-design/image 16.svg";
import {
  MINE_STATIONS,
  RADICALS,
  WORLD,
  atLeast,
  type Chapter,
  type MineStationId,
} from "../data";
import { pick, useLang, useT } from "../i18n";
import { sfx, useGame } from "../store";
import { ShapedRadicalTile } from "../components/PouchModal";

type BuriedArtifact = {
  id: string;
  char: string;
  cells: [number, number][]; // [row, col] in 5x5 grid
  required: boolean;
};

/** Builds a deterministic 5x5 Stardew-style artifact layout for the current chapter. */
function buildChapterArtifacts(chapter: Chapter): BuriedArtifact[] {
  const [c1, c2] = chapter.digChars;
  return [
    {
      id: `${chapter.id}_req1_${c1}`,
      char: c1,
      // Vertical 1x3 on the left side of the 5x5 grid
      cells: [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      required: true,
    },
    {
      id: `${chapter.id}_req2_${c2}`,
      char: c2,
      // Square 2x2 on the right side of the 5x5 grid
      cells: [
        [2, 3],
        [2, 4],
        [3, 3],
        [3, 4],
      ],
      required: true,
    },
    {
      id: `${chapter.id}_bonus_h`,
      char: "一",
      // Horizontal 1x2 at top right
      cells: [
        [0, 3],
        [0, 4],
      ],
      required: false,
    },
  ];
}

export function MineMap({
  chapter,
  pos,
  facing,
  moving,
  scale,
  camX,
  camY,
  nearMineStation,
  onShowToast,
  onAllRequiredDug,
}: {
  chapter: Chapter;
  pos: { x: number; y: number };
  facing: number;
  moving: boolean;
  scale: number;
  camX: number;
  camY: number;
  nearMineStation: MineStationId | undefined;
  onShowToast: (msg: string) => void;
  onAllRequiredDug: () => void;
}) {
  const { state, update, changeMap } = useGame();
  const t = useT();
  const lang = useLang();

  const [gridOpen, setGridOpen] = useState(true);
  const [selectedCell, setSelectedCell] = useState<[number, number]>([2, 3]);
  const [foundPopup, setFoundPopup] = useState<{ char: string; meaning: string } | null>(null);

  const artifacts = useMemo(() => buildChapterArtifacts(chapter), [chapter]);
  const dugList = state.excavatedCells[chapter.id] ?? [];
  const dugSet = useMemo(() => new Set(dugList), [dugList]);

  const isArtifactComplete = (art: BuriedArtifact, set: Set<string>) =>
    art.cells.every(([r, c]) => set.has(`${r},${c}`));

  const digCell = (r: number, c: number) => {
    const key = `${r},${c}`;
    setSelectedCell([r, c]);
    if (dugSet.has(key)) {
      sfx("tap");
      return;
    }

    sfx("dig");
    const nextDug = [...dugList, key];
    const nextSet = new Set(nextDug);

    // Check if any buried artifact just became fully uncovered
    const newlyRevealed = artifacts.filter(
      (art) => !isArtifactComplete(art, dugSet) && isArtifactComplete(art, nextSet),
    );

    update((g) => {
      let nextPieces = [...g.pieces];
      for (const rev of newlyRevealed) {
        const pieceId = `${rev.id}`;
        if (!nextPieces.some((p) => p.id === pieceId)) {
          nextPieces.push({
            id: pieceId,
            char: rev.char,
            size: RADICALS[rev.char]?.size ?? "2x2",
            discoveredAt: "Radical Mine",
          });
        }
      }

      const req1Done = isArtifactComplete(artifacts[0]!, nextSet);
      const req2Done = isArtifactComplete(artifacts[1]!, nextSet);
      const allReqDone = req1Done && req2Done;

      return {
        ...g,
        excavatedCells: {
          ...g.excavatedCells,
          [chapter.id]: nextDug,
        },
        rocks: {
          rock1: req1Done ? 0 : g.rocks.rock1,
          rock2: req2Done ? 0 : g.rocks.rock2,
        },
        pieces: nextPieces,
        step: allReqDone && (g.step === "mine" || g.step === "arrival") ? "shrine" : g.step,
      };
    });

    if (newlyRevealed.length > 0) {
      const rev = newlyRevealed[0]!;
      sfx("good");
      const meaning = RADICALS[rev.char] ? pick(RADICALS[rev.char]!.meaning, lang) : "";
      setFoundPopup({ char: rev.char, meaning });
      onShowToast(t("foundPiece", { char: rev.char }));
      setTimeout(() => setFoundPopup(null), 2800);

      const req1Done = isArtifactComplete(artifacts[0]!, nextSet);
      const req2Done = isArtifactComplete(artifacts[1]!, nextSet);
      if (req1Done && req2Done) {
        setTimeout(() => {
          onAllRequiredDug();
        }, 900);
      }
    }
  };

  const handleDigButton = () => {
    const [r, c] = selectedCell;
    if (!dugSet.has(`${r},${c}`)) {
      digCell(r, c);
      return;
    }
    // Find next un-dug cell belonging to a required artifact
    for (const art of artifacts) {
      for (const [ar, ac] of art.cells) {
        if (!dugSet.has(`${ar},${ac}`)) {
          digCell(ar, ac);
          return;
        }
      }
    }
  };

  const possibleShowcase = Array.from(new Set([chapter.digChars[0], "一", "冂", chapter.digChars[1]]));

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Walkable Radical Mine 2D World */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: WORLD.w,
          height: WORLD.h,
          transform: `translate(${camX}px, ${camY}px) scale(${scale})`,
        }}
      >
        <img
          src={mineMapImg}
          alt="Radical Mine clearing"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Excavation Pit Landmark Banner */}
        <button
          type="button"
          onClick={() => {
            sfx("tap");
            setGridOpen(true);
          }}
          className="pointer-events-auto absolute flex items-center gap-2 rounded-xl border-3 border-[#6e4b2a] bg-[#f5ead4] px-4 py-1.5 font-display text-lg font-bold text-[#3b2818] shadow-md transition hover:scale-105"
          style={{ left: 840, top: 270, zIndex: 900 }}
        >
          <span>⛏</span> {t("radicalMine")}
        </button>

        {/* Return to Mochi Village Landmark Sign on East Path */}
        <button
          type="button"
          onClick={() => changeMap("village")}
          className="pointer-events-auto absolute flex items-center gap-2 rounded-xl border-3 border-[#6e4b2a] bg-[#f5ead4] px-4 py-2 font-display text-lg font-bold text-[#3b2818] shadow-md transition hover:scale-105"
          style={{ left: MINE_STATIONS.villageExit.x - 95, top: MINE_STATIONS.villageExit.y - 90, zIndex: 900 }}
        >
          <span>🏡</span> {t("mochiVillage")} →
        </button>

        {/* Glowing rocks at Dig Site A & B */}
        {state.rocks.rock1 > 0 && (
          <img
            src={rockImg}
            alt="Dig Site A"
            onClick={() => setGridOpen(true)}
            className="pointer-events-auto absolute cursor-pointer animate-glow transition hover:scale-105"
            style={{
              left: MINE_STATIONS.rock1.x - 65,
              top: MINE_STATIONS.rock1.y - 65,
              width: 130,
              height: 130,
              zIndex: MINE_STATIONS.rock1.y,
            }}
          />
        )}
        {state.rocks.rock2 > 0 && (
          <img
            src={rockImg}
            alt="Dig Site B"
            onClick={() => setGridOpen(true)}
            className="pointer-events-auto absolute cursor-pointer animate-glow transition hover:scale-105"
            style={{
              left: MINE_STATIONS.rock2.x - 65,
              top: MINE_STATIONS.rock2.y - 65,
              width: 130,
              height: 130,
              zIndex: MINE_STATIONS.rock2.y,
            }}
          />
        )}

        {/* Mochi Character in the Mine */}
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
            alt="Mochi"
            className={moving ? "animate-bob" : ""}
            style={{ transform: `scaleX(${facing})`, width: 110, height: 110 }}
            draggable={false}
          />
        </div>

        {nearMineStation && !gridOpen && (
          <div
            className="pointer-events-none absolute rounded-full bg-card px-3 py-1 text-sm font-bold shadow-[var(--shadow-soft)]"
            style={{ left: pos.x - 50, top: pos.y - 130, zIndex: 3000 }}
          >
            [E] {pick(MINE_STATIONS[nearMineStation].label, lang)}
          </div>
        )}
      </div>

      {/* Floating button when grid is closed */}
      {!gridOpen && (
        <div className="pointer-events-auto absolute bottom-20 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          <button
            type="button"
            onClick={() => {
              sfx("tap");
              setGridOpen(true);
            }}
            className="btn-game btn-accent px-5 py-2.5 text-base shadow-lg"
          >
            ⛏ {t("openExcavation")}
          </button>
          <button
            type="button"
            onClick={() => changeMap("village")}
            className="btn-game btn-ghost px-5 py-2.5 text-base shadow-lg"
          >
            🏡 {t("returnToVillage")}
          </button>
        </div>
      )}

      {/* "You found a piece!" popup card matching bottom-right of game-ui-design.png */}
      {foundPopup && (
        <div className="pointer-events-none absolute bottom-24 right-8 z-50 flex animate-pop items-center gap-3 rounded-2xl border-3 border-[#6e4b2a] bg-[#f7eed9] px-4 py-3 shadow-xl">
          <ShapedRadicalTile char={foundPopup.char} compact />
          <div>
            <div className="font-display text-base font-bold text-[#3b2818]">
              {t("youFoundPiece")}
            </div>
            <div className="text-xs font-bold text-[#6e4f35]">
              {foundPopup.char} ({foundPopup.meaning})
            </div>
          </div>
        </div>
      )}

      {/* Stardew Valley-style Radical Mine Excavation Panel (matches top-right of game-ui-design.png) */}
      {gridOpen && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-3 backdrop-blur-[2px]">
          <div className="relative w-full max-w-4xl rounded-3xl border-4 border-[#6e4b2a] bg-[#f6ebd4] p-4 shadow-2xl sm:p-6">
            {/* Top Banner Tab */}
            <div className="-mt-9 mb-3 inline-flex items-center gap-2 rounded-2xl border-3 border-[#6e4b2a] bg-[#ecd9b4] px-5 py-2 shadow-md">
              <span className="text-xl">⛏</span>
              <h2 className="font-display text-2xl font-bold text-[#3b2818]">
                {t("radicalMine")}
              </h2>
            </div>

            {/* Close & Return to Village Controls */}
            <div className="absolute right-4 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMap("village")}
                className="rounded-full border-2 border-[#6e4b2a] bg-[#ecd9b4] px-3 py-1 text-xs font-bold text-[#3b2818] hover:bg-[#e1c89b]"
              >
                🏡 {t("returnToVillage")}
              </button>
              <button
                type="button"
                onClick={() => setGridOpen(false)}
                aria-label={t("close")}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#6e4b2a] bg-[#fbf5e6] font-bold text-[#3b2818] hover:bg-[#ecd9b4]"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.08fr_1fr]">
              {/* Left: 5x5 Tiled Excavation Soil Board */}
              <div className="relative overflow-hidden rounded-2xl border-4 border-[#5c3e26] bg-[#755336] p-3 shadow-inner">
                {/* Ambient mine background */}
                <img
                  src={mineMapImg}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
                />

                {/* Mochi Miner Sprite in the top-left of the grid */}
                <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-[#3b2818]/75 px-2.5 py-1 text-xs font-bold text-[#f7eed9]">
                  <img
                    src={tanukiDigImg}
                    alt="Mochi digging"
                    className="h-8 w-8 object-contain"
                  />
                  <span>
                    {atLeast(state.step, "shrine")
                      ? "✓ Chapter Radicals Found!"
                      : `${chapter.digChars[0]} & ${chapter.digChars[1]}`}
                  </span>
                </div>

                <div className="relative z-10 mt-9 grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }, (_, idx) => {
                    const r = Math.floor(idx / 5);
                    const c = idx % 5;
                    const key = `${r},${c}`;
                    const isDug = dugSet.has(key);
                    const isSelected = selectedCell[0] === r && selectedCell[1] === c;

                    // Check if an artifact occupies this cell
                    const art = artifacts.find((a) =>
                      a.cells.some(([ar, ac]) => ar === r && ac === c),
                    );
                    const artComplete = art ? isArtifactComplete(art, dugSet) : false;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => digCell(r, c)}
                        aria-label={`Excavate tile ${r + 1},${c + 1}`}
                        className={`relative flex aspect-square items-center justify-center rounded-xl border-2 transition ${
                          isDug
                            ? art
                              ? "border-[#5c3e26] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] shadow-md"
                              : "border-[#523720] bg-[#5e4128]/90"
                            : "border-[#5c3e26] bg-gradient-to-br from-[#8c6440] to-[#6e4c2e] hover:brightness-110"
                        } ${
                          isSelected
                            ? "outline-2 outline-dashed outline-white ring-2 ring-[#f7eed9]"
                            : art && !isDug
                              ? "border-dashed border-[#d9bc8c]/80"
                              : ""
                        }`}
                      >
                        {!isDug && art && (
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#f5deb3]/75" />
                        )}
                        {isDug && art && (
                          <span
                            className={`font-kanji text-2xl font-bold text-[#3b2512] sm:text-3xl ${
                              artComplete ? "animate-pop" : "opacity-80"
                            }`}
                          >
                            {art.char}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Instructions, Possible Pieces, and Green Dig Button */}
              <div className="flex flex-col justify-between gap-4 py-1">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#3b2818]">
                    {t("digUpPieces")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5c3e26]">
                    {t("digInstructions")}
                  </p>

                  <div className="mt-4">
                    <div className="mb-2 text-sm font-bold text-[#3b2818]">
                      {t("possiblePieces")}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[#d4be98] bg-[#efe2c6] p-3">
                      {possibleShowcase.map((ch) => {
                        const owned = state.pieces.some((p) => p.char === ch);
                        return (
                          <div key={ch} className="flex flex-col items-center gap-1">
                            <ShapedRadicalTile
                              char={ch}
                              compact
                              selected={owned}
                            />
                            <span className="text-[10px] font-bold text-[#5c3e26]">
                              {RADICALS[ch]?.size ?? "2×2"} {owned ? "✓" : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Primary Green Dig Button + Return Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDigButton}
                    className="group relative flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border-3 border-[#2e5936] bg-gradient-to-b from-[#559a60] to-[#3e7b48] py-3 font-display text-xl font-bold text-white shadow-[0_5px_0_0_#264a2c] transition active:translate-y-1"
                  >
                    <img
                      src={digBtnSvg}
                      alt=""
                      className="hidden h-7 w-7 object-contain"
                    />
                    <span>⛏ {t("digBtn")}</span>
                  </button>

                  {atLeast(state.step, "shrine") && (
                    <button
                      type="button"
                      onClick={() => changeMap("village")}
                      className="btn-game btn-accent w-full max-w-xs text-sm"
                    >
                      ✨ {t("returnToVillage")} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MineMap;
