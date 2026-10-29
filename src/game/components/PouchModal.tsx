import { useState } from "react";
import { CHAPTERS, RADICALS } from "../data";
import { pick, useLang, useT } from "../i18n";
import { sfx, type Piece } from "../store";
import { Modal } from "./Modal";
import pouchFrameSvg from "@/assets/new-design/image 11.svg";

/** Renders a shaped wooden radical tile matching game-ui-design.png ("Radical pieces / Inventory"). */
export function ShapedRadicalTile({
  char,
  selected,
  count,
  onClick,
  compact = false,
}: {
  char: string;
  selected?: boolean;
  count?: number;
  onClick?: () => void;
  compact?: boolean;
}) {
  const meta = RADICALS[char];
  const size = meta?.size ?? "2x2";

  const dims = compact
    ? size === "1x3"
      ? "h-16 w-9"
      : size === "1x4"
        ? "h-9 w-16"
        : size === "2x3"
          ? "h-14 w-14"
          : size === "1x1"
            ? "h-11 w-9"
            : "h-14 w-14"
    : size === "1x3"
      ? "h-24 w-12"
      : size === "1x4"
        ? "h-12 w-24"
        : size === "2x3"
          ? "h-20 w-20"
          : size === "1x1"
            ? "h-14 w-11"
            : "h-20 w-20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-[#6e4b2a] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] font-kanji text-[#3b2512] shadow-[0_4px_0_0_#5c3e26] transition hover:-translate-y-0.5 active:translate-y-0.5 ${dims} ${
        selected ? "ring-4 ring-[#4b8b55]" : ""
      }`}
    >
      {/* Decorative wood grain corners */}
      <span className="pointer-events-none absolute left-1 top-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className="pointer-events-none absolute right-1 top-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className="pointer-events-none absolute bottom-1 left-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className="pointer-events-none absolute bottom-1 right-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className={compact ? "text-2xl font-bold" : "text-3xl font-bold"}>{char}</span>
      {typeof count === "number" && count > 1 && (
        <span className="absolute -bottom-1.5 -right-1.5 rounded-full border border-[#5c3e26] bg-[#4b8b55] px-1.5 py-0.2 text-[10px] font-bold text-white">
          ×{count}
        </span>
      )}
    </button>
  );
}

export function PouchModal({
  pieces,
  discovered,
  onClose,
}: {
  pieces: Piece[];
  discovered: string[];
  onClose: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [filter, setFilter] = useState<"all" | "unused" | "used">("all");
  const [selectedChar, setSelectedChar] = useState<string | null>(pieces[0]?.char ?? null);

  // Group pieces by character and count duplicates
  const grouped = pieces.reduce<Record<string, { piece: Piece; count: number; usedIn: string[] }>>(
    (acc, p) => {
      const usedIn = CHAPTERS.filter(
        (ch) => discovered.includes(ch.kanji.char) && ch.kanji.parts.includes(p.char),
      ).map((ch) => ch.kanji.char);
      if (!acc[p.char]) {
        acc[p.char] = { piece: p, count: 1, usedIn };
      } else {
        acc[p.char]!.count += 1;
      }
      return acc;
    },
    {},
  );

  const entries = Object.values(grouped).filter((item) => {
    if (filter === "unused") return item.usedIn.length === 0;
    if (filter === "used") return item.usedIn.length > 0;
    return true;
  });

  const activeEntry =
    (selectedChar ? grouped[selectedChar] : undefined) ?? entries[0] ?? null;

  // Fill 16 slots to match the 4x4 pouch grid in new-design/image 11.svg
  const slots = Array.from({ length: 16 }, (_, i) => entries[i] ?? null);

  return (
    <Modal title={`🎒 ${t("radicalPouch")}`} onClose={onClose} wide>
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        {/* Left: 4x4 Pouch Grid styled after image 11.svg */}
        <div className="relative mx-auto w-full max-w-[320px]">
          <img
            src={pouchFrameSvg}
            alt="Radical Pouch Frame"
            className="pointer-events-none w-full select-none object-contain drop-shadow-md"
          />
          <div className="absolute bottom-[8%] left-[9%] right-[9%] top-[24%] grid grid-cols-4 grid-rows-4 gap-2">
            {slots.map((slot, idx) =>
              slot ? (
                <button
                  key={slot.piece.char}
                  type="button"
                  onClick={() => {
                    sfx("tap");
                    setSelectedChar(slot.piece.char);
                  }}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-[#6e4b2a] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] font-kanji text-2xl font-bold text-[#3b2512] shadow-sm transition hover:scale-105 ${
                    activeEntry?.piece.char === slot.piece.char
                      ? "ring-3 ring-[#4b8b55]"
                      : ""
                  }`}
                >
                  {slot.piece.char}
                  {slot.count > 1 && (
                    <span className="absolute bottom-0.5 right-1 font-sans text-[10px] font-extrabold text-[#5c3e26]">
                      {slot.count}
                    </span>
                  )}
                </button>
              ) : (
                <div
                  key={idx}
                  className="rounded-lg border border-dashed border-[#bfa67a]/40 bg-transparent"
                />
              ),
            )}
          </div>
        </div>

        {/* Right: Filter bar, shaped radical showcase, and item inspector */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1.5">
                {(["all", "unused", "used"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      sfx("tap");
                      setFilter(f);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      filter === f
                        ? "bg-[#4b8b55] text-white shadow-xs"
                        : "bg-[#e7d7b8] text-[#5c3e26] hover:bg-[#dcc79f]"
                    }`}
                  >
                    {f === "all"
                      ? t("filterAll")
                      : f === "unused"
                        ? t("filterUnused")
                        : t("filterUsed")}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#6e4f35]">
                {pieces.length} {t("pouch")}
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#b99e75] bg-[#f8efe0] p-6 text-center text-sm text-[#6e4f35]">
                {t("pouchEmptyDesc")}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[#c8b28e] bg-[#f8efe0] p-3">
                {entries.map((entry) => (
                  <div key={entry.piece.char} className="flex flex-col items-center gap-1">
                    <ShapedRadicalTile
                      char={entry.piece.char}
                      count={entry.count}
                      selected={activeEntry?.piece.char === entry.piece.char}
                      onClick={() => {
                        sfx("tap");
                        setSelectedChar(entry.piece.char);
                      }}
                    />
                    <span className="text-[11px] font-bold text-[#5c3e26]">
                      {RADICALS[entry.piece.char]
                        ? pick(RADICALS[entry.piece.char]!.shapeLabel, lang)
                        : "2 × 2"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Radical Details Table */}
          {activeEntry && (
            <div className="rounded-2xl border-2 border-[#7b5836] bg-[#fbf5e6] p-4 shadow-xs">
              <div className="flex items-center gap-4">
                <ShapedRadicalTile char={activeEntry.piece.char} compact />
                <div>
                  <div className="font-display text-xl font-bold text-[#3b2818]">
                    {activeEntry.piece.char} ·{" "}
                    {RADICALS[activeEntry.piece.char]
                      ? pick(RADICALS[activeEntry.piece.char]!.meaning, lang)
                      : ""}
                  </div>
                  <div className="text-xs text-[#6e4f35]">
                    {RADICALS[activeEntry.piece.char]?.name ?? ""} ·{" "}
                    {RADICALS[activeEntry.piece.char]
                      ? pick(RADICALS[activeEntry.piece.char]!.shapeLabel, lang)
                      : "Square (2 × 2)"}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-[#efe2c6] px-3 py-1.5">
                  <span className="font-bold text-[#6e4f35]">{t("discoveredAt")}:</span>{" "}
                  <span className="font-bold text-[#3b2818]">
                    {activeEntry.piece.discoveredAt ?? t("radicalMine")}
                  </span>
                </div>
                <div className="rounded-lg bg-[#efe2c6] px-3 py-1.5">
                  <span className="font-bold text-[#6e4f35]">Status:</span>{" "}
                  <span className="font-bold text-[#4b8b55]">{t("statusCollected")}</span>
                </div>
                <div className="col-span-2 rounded-lg bg-[#efe2c6] px-3 py-1.5">
                  <span className="font-bold text-[#6e4f35]">{t("usedIn")}:</span>{" "}
                  <span className="font-kanji text-sm font-bold text-[#3b2818]">
                    {activeEntry.usedIn.length > 0
                      ? activeEntry.usedIn.join(", ")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
