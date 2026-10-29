import { useState } from "react";
import { CHAPTERS, RADICALS } from "../data";
import { pick, useLang, useT } from "../i18n";
import { sfx, type Piece } from "../store";
import { Modal } from "./Modal";

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
      ? "h-14 w-9"
      : size === "1x4"
        ? "h-9 w-16"
        : size === "2x3"
          ? "h-12 w-14"
          : size === "1x1"
            ? "h-10 w-10"
            : "h-12 w-12"
    : size === "1x3"
      ? "h-20 w-11"
      : size === "1x4"
        ? "h-11 w-20"
        : size === "2x3"
          ? "h-16 w-20"
          : size === "1x1"
            ? "h-12 w-12"
            : "h-16 w-16";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex shrink-0 flex-col items-center justify-center rounded-xl border-2 border-[#6e4b2a] bg-gradient-to-b from-[#f3dfb9] to-[#dfbe88] font-kanji text-[#3b2512] shadow-[0_4px_0_0_#5c3e26] transition hover:-translate-y-0.5 active:translate-y-0.5 ${dims} ${
        selected ? "ring-4 ring-[#4b8b55]" : ""
      }`}
    >
      {/* Decorative wood grain corners */}
      <span className="pointer-events-none absolute left-1 top-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className="pointer-events-none absolute right-1 top-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className="pointer-events-none absolute bottom-1 left-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className="pointer-events-none absolute bottom-1 right-1 h-1 w-1 rounded-full bg-[#6e4b2a]/50" />
      <span className={compact ? "text-xl font-bold leading-none" : "text-2xl font-bold leading-none"}>
        {char}
      </span>
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

  // Dynamically size the slot grid so it always fits all collected entries (minimum 8 slots, expanding in rows of 4)
  const totalSlots = Math.max(8, Math.ceil(entries.length / 4) * 4);
  const slots = Array.from({ length: totalSlots }, (_, i) => entries[i] ?? null);

  return (
    <Modal title={`🎒 ${t("radicalPouch")}`} onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        {/* Top Filter & Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#c8b28e] bg-[#efe2c6] px-4 py-2.5">
          <div className="flex flex-wrap gap-2">
            {(["all", "unused", "used"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  sfx("tap");
                  setFilter(f);
                }}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                  filter === f
                    ? "bg-[#4b8b55] text-white shadow-xs"
                    : "bg-[#f8efe0] text-[#5c3e26] hover:bg-[#e5d2b0]"
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
          <span className="rounded-full bg-[#f8efe0] px-3 py-1 text-xs font-extrabold text-[#5c3e26]">
            🎒 {entries.length} {t("pouch")}
          </span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* Left: Expandable Pouch Slot Grid that grows with collected pieces */}
          <div className="rounded-2xl border-4 border-[#6e4b2a] bg-[#ecd9b4] p-4 shadow-inner">
            {entries.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-[#a6895b] bg-[#f8efe0] p-8 text-center text-sm font-medium text-[#6e4f35]">
                {t("pouchEmptyDesc")}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {slots.map((slot, idx) => {
                  if (!slot) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="flex min-h-[116px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bfa67a]/70 bg-[#e2cca2]/55 p-2"
                      >
                        <span className="text-xl opacity-25">🎒</span>
                      </div>
                    );
                  }
                  const isSelected = activeEntry?.piece.char === slot.piece.char;
                  const meta = RADICALS[slot.piece.char];
                  return (
                    <div
                      key={slot.piece.char}
                      onClick={() => {
                        sfx("tap");
                        setSelectedChar(slot.piece.char);
                      }}
                      className={`flex min-h-[116px] cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-2.5 transition ${
                        isSelected
                          ? "border-[#4b8b55] bg-[#f9f2e2] ring-2 ring-[#4b8b55] shadow-md"
                          : "border-[#b99e75] bg-[#f5ead4] hover:border-[#6e4b2a] hover:bg-[#fbf5e6]"
                      }`}
                    >
                      <div className="flex flex-1 items-center justify-center py-1">
                        <ShapedRadicalTile
                          char={slot.piece.char}
                          count={slot.count}
                          selected={isSelected}
                          compact
                          onClick={() => {
                            sfx("tap");
                            setSelectedChar(slot.piece.char);
                          }}
                        />
                      </div>
                      <span className="mt-1 text-center text-[11px] font-bold leading-tight text-[#5c3e26]">
                        {meta ? pick(meta.meaning, lang) : slot.piece.char}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Radical Details Inspector */}
          <div className="rounded-2xl border-3 border-[#7b5836] bg-[#fbf5e6] p-4 shadow-sm">
            {activeEntry ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b-2 border-[#e5d5b5] pb-3">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-[#c8b28e] bg-[#f3e6cb] p-2">
                    <ShapedRadicalTile char={activeEntry.piece.char} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-2xl font-bold text-[#3b2818]">
                      {activeEntry.piece.char} ·{" "}
                      {RADICALS[activeEntry.piece.char]
                        ? pick(RADICALS[activeEntry.piece.char]!.meaning, lang)
                        : ""}
                    </div>
                    <div className="mt-0.5 text-xs font-bold text-[#6e4f35]">
                      {RADICALS[activeEntry.piece.char]?.name ?? ""}
                    </div>
                    <div className="mt-1 inline-block rounded-md bg-[#ecd9b4] px-2 py-0.5 text-[11px] font-bold text-[#4a321f]">
                      {RADICALS[activeEntry.piece.char]
                        ? pick(RADICALS[activeEntry.piece.char]!.shapeLabel, lang)
                        : "Square (2 × 2)"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl bg-[#efe2c6] px-3 py-2">
                    <div className="font-bold text-[#6e4f35]">{t("discoveredAt")}</div>
                    <div className="mt-0.5 font-bold text-[#3b2818]">
                      {activeEntry.piece.discoveredAt ?? t("radicalMine")}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#efe2c6] px-3 py-2">
                    <div className="font-bold text-[#6e4f35]">Status</div>
                    <div className="mt-0.5 font-bold text-[#4b8b55]">
                      ✓ {t("statusCollected")}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl bg-[#efe2c6] px-3 py-2">
                    <div className="font-bold text-[#6e4f35]">{t("usedIn")}</div>
                    <div className="mt-0.5 font-kanji text-base font-bold text-[#3b2818]">
                      {activeEntry.usedIn.length > 0
                        ? activeEntry.usedIn.join(", ")
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-[#6e4f35]">
                {t("pouchEmptyDesc")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
