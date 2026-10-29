import { useMemo, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { splitFurigana } from "../Furigana";
import { lookupKanji } from "../data";
import { useT } from "../i18n";

/** CJK Unified Ideographs (incl. extension A) — treated as kanji. */
const KANJI_RE = /[\u3400-\u9fff]/;

/**
 * ClickableKanjiText — renders a Japanese string and turns every kanji that
 * has word-type data (chapter kanji + the extra dictionary) into a clickable
 * element. Clicking one opens the KanjiPopup classification for that kanji.
 *
 * Furigana (kana readings) render above the kanji when `enableFurigana` and
 * `kana` are provided, reusing the same alignment as the Furigana component.
 */
export function ClickableKanjiText({
  jp,
  kana,
  enableFurigana,
  onInspect,
  className,
}: {
  jp: string;
  kana?: string | undefined;
  enableFurigana?: boolean | undefined;
  onInspect?: ((char: string, e: ReactMouseEvent) => void) | undefined;
  className?: string | undefined;
}) {
  const t = useT();
  const segs = useMemo(
    () => (enableFurigana && kana ? splitFurigana(jp, kana) : [{ text: jp }]),
    [jp, kana, enableFurigana],
  );

  const renderTokens = (text: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let plain = "";
    const flush = () => {
      if (plain) {
        nodes.push(<span key={`p${nodes.length}`}>{plain}</span>);
        plain = "";
      }
    };
    for (const ch of text) {
      if (KANJI_RE.test(ch) && lookupKanji(ch) && onInspect) {
        flush();
        nodes.push(
          <span
            key={`k${nodes.length}`}
            role="button"
            tabIndex={0}
            title={`${ch} — ${t("wordType")}`}
            onClick={(e) => {
              e.stopPropagation();
              onInspect(ch, e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onInspect(ch, e as unknown as ReactMouseEvent);
              }
            }}
            className="cursor-pointer underline decoration-dotted decoration-[#4b8b55]/80 decoration-2 underline-offset-4 transition hover:text-[#4b8b55]"
          >
            {ch}
          </span>
        );
      } else {
        plain += ch;
      }
    }
    flush();
    return nodes;
  };

  return (
    <span className={className}>
      {segs.map((s, i) =>
        s.reading ? (
          <ruby key={i}>
            {renderTokens(s.text)}
            <rp>(</rp>
            <rt>{s.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={i}>{renderTokens(s.text)}</span>
        ),
      )}
    </span>
  );
}