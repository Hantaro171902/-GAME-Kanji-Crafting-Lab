import { useMemo } from "react";

/** CJK Unified Ideographs (incl. extension A) — treated as kanji needing a reading. */
const KANJI_RE = /[\u3400-\u9fff]/;

export type FuriganaSegment = { text: string; reading?: string };

/**
 * Aligns a kanji-bearing Japanese string with its full kana reading and
 * splits it into segments suitable for `<ruby>` rendering. Each kanji run
 * gets the kana that sits directly above it (whole-run ruby); kana runs are
 * emitted as plain text.
 *
 * The kana string is treated as a sequence of [reading][plain][reading][plain]…
 * where each plain run (kana + punctuation) must appear verbatim in the kana
 * string — punctuation acts as a strong anchor. When a plain run matches at
 * several positions (e.g. a particle that also occurs inside a reading), the
 * boundary that minimises the longest reading is chosen, which matches how a
 * learner would naturally split the sentence.
 */
export function splitFurigana(jp: string, kana: string): FuriganaSegment[] {
  const memo = new Map<string, FuriganaSegment[] | null>();

  const align = (text: string, seq: string): FuriganaSegment[] | null => {
    const key = text + "\u0000" + seq;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    let result: FuriganaSegment[] | null = null;

    if (text.length === 0) {
      result = seq.length === 0 ? [] : null;
    } else if (!KANJI_RE.test(text[0]!)) {
      // Plain run (kana + punctuation) — must match the kana string verbatim.
      let j = 0;
      while (j < text.length && !KANJI_RE.test(text[j]!)) j++;
      const run = text.slice(0, j);
      if (seq.startsWith(run)) {
        const rest = align(text.slice(j), seq.slice(run.length));
        if (rest) result = [{ text: run }, ...rest];
      }
    } else {
      // Kanji run — its reading ends where the following plain run begins.
      let j = 0;
      while (j < text.length && KANJI_RE.test(text[j]!)) j++;
      const run = text.slice(0, j);

      let nextPlain = "";
      for (let k = j; k < text.length && !KANJI_RE.test(text[k]!); k++) nextPlain += text[k];

      const candidates: number[] = [];
      if (nextPlain) {
        for (let b = 1; b <= seq.length - nextPlain.length; b++) {
          if (seq.slice(b).startsWith(nextPlain)) candidates.push(b);
        }
      } else {
        candidates.push(seq.length);
      }

      let best: FuriganaSegment[] | null = null;
      let bestMax = Infinity;
      for (const b of candidates) {
        const reading = seq.slice(0, b);
        if (!reading) continue;
        const rest = align(text.slice(j), seq.slice(b));
        if (!rest) continue;
        const segs: FuriganaSegment[] = [{ text: run, reading }, ...rest];
        const maxLen = Math.max(...segs.filter((s) => s.reading).map((s) => s.reading!.length));
        if (maxLen < bestMax) {
          bestMax = maxLen;
          best = segs;
        }
      }
      result = best;
    }

    memo.set(key, result);
    return result;
  };

  return align(jp, kana) ?? [{ text: jp }];
}

/**
 * Renders Japanese text with furigana (kana readings) above kanji.
 * Falls back to plain text when no kana reading is supplied.
 */
export function Furigana({ text, kana, className }: { text: string; kana?: string; className?: string }) {
  const segs = useMemo<FuriganaSegment[]>(
    () => (kana ? splitFurigana(text, kana) : [{ text }]),
    [text, kana],
  );

  return (
    <span className={className}>
      {segs.map((s, i) =>
        s.reading ? (
          <ruby key={i}>
            {s.text}
            <rp>(</rp>
            <rt>{s.reading}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </span>
  );
}