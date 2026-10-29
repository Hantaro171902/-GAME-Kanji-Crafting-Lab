import { useEffect, useRef } from "react";
import { POS_LABELS, type KanjiLookup } from "../data";
import { pick, useLang, useT } from "../i18n";

/**
 * KanjiPopup — small lookup popup shown right on a kanji when the player
 * clicks the character or presses J. Displays the word type (part of
 * speech), the on/kun readings and the localized meaning, following the
 * language chosen in Settings.
 *
 * The popup is positioned above the anchor point (top-center of the word);
 * when the anchor is near the top of the screen it flips below instead.
 */
export function KanjiPopup({
  kanji,
  x,
  y,
  onClose,
}: {
  kanji: KanjiLookup | undefined;
  x: number;
  y: number;
  onClose: () => void;
}) {
  const lang = useLang();
  const t = useT();
  const ref = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside the popup.
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [onClose]);

  if (!kanji) return null;

  const WIDTH = 256; // w-64
  const flipBelow = y < 220;
  const left = Math.max(8, Math.min(window.innerWidth - WIDTH - 8, x - WIDTH / 2));

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`${kanji.char} — ${t("wordType")}`}
      className="pointer-events-auto fixed z-[70] w-64 animate-pop rounded-2xl border-4 border-[#6e4b2a] bg-[#f6ebd4] p-3 shadow-[0_8px_0_0_rgba(0,0,0,0.25)]"
      style={{
        left,
        top: flipBelow ? y + 12 : y - 8,
        transform: flipBelow ? "none" : "translateY(-100%)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-kanji text-4xl font-bold leading-none text-[#3b2818]">
            {kanji.char}
          </span>
          <span className="font-display text-xl font-bold leading-tight text-[#4b8b55]">
            {pick(kanji.meaning, lang)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="-mr-1 -mt-1 rounded-lg px-1.5 text-sm font-bold text-[#6e4f35] transition hover:bg-[#ecd9b4]"
        >
          ✕
        </button>
      </div>

      <div className="mt-1.5">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6e4f35]">
          {t("wordType")}
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {kanji.pos.map((p) => (
            <span
              key={p}
              className="rounded-full border border-[#6e4b2a] bg-[#ecd9b4] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[#3b2818]"
            >
              {pick(POS_LABELS[p], lang)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 space-y-0.5 border-t border-[#d4be98] pt-2 text-sm text-[#5c3e26]">
        <div>
          <b>{t("on")}</b> {kanji.on}
        </div>
        <div>
          <b>{t("kun")}</b> {kanji.kun}
        </div>
      </div>
    </div>
  );
}