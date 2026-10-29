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

type CellRadical = {
  key: string;
  row: number;
  col: number;
  /** null means this cell is empty dirt when excavated */
  char: string | null;
  required: boolean;
};

/**
 * Generates a 5x5 (25 cells) grid where:
 * - 15 cells hold UNIQUE radical characters (no duplicates, always including
 *   `chapter.digChars[0]` and `chapter.digChars[1]`)
 * - 10 cells are randomly EMPTY (`char: null`)
 */
function buildUniqueMineGrid(chapter: Chapter): CellRadical[] {
  const [req1, req2] = chapter.digChars;
  const allRadicals = Object.keys(RADICALS);
  const others = allRadicals.filter((c) => c !== req1 && c !== req2);

  // 2 required radicals + 13 unique non-required radicals + 10 empty cells = 25 cells
  const pool: (string | null)[] = [
    req1,
    req2,
    ...others.slice(0, 13),
    ...Array.from({ length: 10 }, () => null),
  ];

  // Deterministic shuffle per chapter using Fisher-Yates
  const shuffled = [...pool];
  let seed =
    chapter.num * 9973 +
    req1.codePointAt(0)! * 31 +
    req2.codePointAt(0)! * 17;
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = shuffled[i] ?? null;
    shuffled[i] = shuffled[j] ?? null;
    shuffled[j] = tmp;
  }

  return shuffled.map((char, idx) => {
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    return {
      key: `${row},${col}`,
      row,
      col,
      char,
      required: char === req1 || char === req2,
    };
  });
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
  const [selectedCell, setSelectedCell] = useState<[number, number]>([2, 2]);
  const [foundPopup, setFoundPopup] = useState<{ char: string; meaning: string } | null>(null);

  const gridCells = useMemo(() => buildUniqueMineGrid(chapter), [chapter]);
  const dugList = state.excavatedCells[chapter.id] ?? [];
  const dugSet = useMemo(() => new Set(dugList), [dugList]);

  const digCell = (r: number, c: number) => {
    const key = `${r},${c}`;
    setSelectedCell([r, c]);
    if (dugSet.has(key)) {
      sfx("tap");
      return;
    }

    const cell = gridCells.find((item) => item.row === r && item.col === c);
    if (!cell) return;

    sfx("dig");
    const nextDug = [...dugList, key];
    const nextSet = new Set(nextDug);

    const req1Cell = gridCells.find((item) => item.char === chapter.digChars[0]);
    const req2Cell = gridCells.find((item) => item.char === chapter.digChars[1]);
    const req1Done = req1Cell ? nextSet.has(req1Cell.key) : false;
    const req2Done = req2Cell ? nextSet.has(req2Cell.key) : false;
    const allReqDone = req1Done && req2Done;

    const cellChar = cell.char;

    update((g) => {
      const nextPieces =
        cellChar === null || g.pieces.some((p) => p.char === cellChar)
          ? g.pieces
          : [
              ...g.pieces,
              {
                id: `${chapter.id}_cell_${cellChar}`,
                char: cellChar,
                size: RADICALS[cellChar]?.size ?? "2x2",
                discoveredAt: "Radical Mine",
              },
            ];

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

    if (cellChar !== null) {
      if (cell.required) {
        sfx("good");
      }
      const meaning = RADICALS[cellChar] ? pick(RADICALS[cellChar]!.meaning, lang) : "";
      setFoundPopup({ char: cellChar, meaning });
      onShowToast(t("foundPiece", { char: cellChar }));
      setTimeout(() => setFoundPopup(null), 2400);
    }

    if (allReqDone && (!dugSet.has(req1Cell?.key ?? "") || !dugSet.has(req2Cell?.key ?? ""))) {
      setTimeout(() => {
        onAllRequiredDug();
      }, 950);
    }
  };

  const handleDigButton = () => {
    const [r, c] = selectedCell;
    if (!dugSet.has(`${r},${c}`)) {
      digCell(r, c);
      return;
    }
    // Pick a random un-dug cell on the board
    const undug = gridCells.filter((cell) => !dugSet.has(cell.key));
    if (undug.length > 0) {
      const pickRandom = undug[Math.floor(Math.random() * undug.length)]!;
      digCell(pickRandom.row, pickRandom.col);
    }
  };

  const possibleShowcase = Array.from(
    new Set([chapter.digChars[0], "一", "冂", chapter.digChars[1]]),
  );

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
          style={{
            left: MINE_STATIONS.villageExit.x - 95,
            top: MINE_STATIONS.villageExit.y - 90,
            zIndex: 900,
          }}
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

      {/* "You found a piece!" popup card */}
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

      {/* Radical Mine 5x5 Unique-Radical Excavation Panel */}
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
              {/* Left: 5x5 Tiled Excavation Soil Board (No hint dots, 25 unique radicals) */}
              <div className="relative overflow-hidden rounded-2xl border-4 border-[#5c3e26] bg-[#755336] p-3 shadow-inner">
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
                  {gridCells.map((cell) => {
                    const isDug = dugSet.has(cell.key);
                    const isSelected =
                      selectedCell[0] === cell.row && selectedCell[1] === cell.col;

                    return (
                      <button
                        key={cell.key}
                        type="button"
                        onClick={() => digCell(cell.row, cell.col)}
                        aria-label={`Excavate tile ${cell.row + 1},${cell.col + 1}`}
                        className={`relative flex aspect-square items-center justify-center rounded-xl border-2 transition ${
                          isDug
                            ? cell.char
                              ? cell.required
                                ? "border-[#4b8b55] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] ring-2 ring-[#4b8b55] shadow-md"
                                : "border-[#5c3e26] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] shadow-sm"
                              : "border-[#4a311c] bg-[#4e341e]/85 shadow-inner"
                            : "border-[#5c3e26] bg-gradient-to-br from-[#8c6440] to-[#6e4c2e] hover:brightness-110"
                        } ${
                          isSelected
                            ? "outline-2 outline-dashed outline-white ring-2 ring-[#f7eed9]"
                            : ""
                        }`}
                      >
                        {isDug && cell.char && (
                          <span className="animate-pop font-kanji text-2xl font-bold text-[#3b2512] sm:text-3xl">
                            {cell.char}
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
                            <ShapedRadicalTile char={ch} compact selected={owned} />
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
                    <img src={digBtnSvg} alt="" className="hidden h-7 w-7 object-contain" />
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
