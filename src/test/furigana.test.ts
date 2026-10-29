import { describe, expect, it } from "vitest";

import { splitFurigana } from "@/game/Furigana";

function render(segs: { text: string; reading?: string }[]): string {
  return segs.map((s) => (s.reading ? `${s.text}[${s.reading}]` : s.text)).join("");
}

describe("splitFurigana", () => {
  it("puts the reading above a kanji run followed by kana", () => {
    expect(render(splitFurigana("休む", "やすむ"))).toBe("休[やす]む");
  });

  it("reads an all-kanji word as one ruby unit", () => {
    expect(render(splitFurigana("休日", "きゅうじつ"))).toBe("休日[きゅうじつ]");
  });

  it("splits a compound into per-run readings", () => {
    expect(render(splitFurigana("明日は休日です。", "あしたはきゅうじつです。"))).toBe(
      "明日[あした]は休日[きゅうじつ]です。",
    );
  });

  it("keeps punctuation as plain text and uses it as an anchor", () => {
    expect(render(splitFurigana("日は太陽、月は月だよ。", "ひはたいよう、つきはつきだよ。"))).toBe(
      "日[ひ]は太陽[たいよう]、月[つき]は月[つき]だよ。",
    );
  });

  it("handles a particle that also occurs inside a reading", () => {
    // 一番重い: the okurigana い also appears inside いちばんおも.
    expect(render(splitFurigana("一番重い岩", "いちばんおもいいわ"))).toBe("一番重[いちばんおも]い岩[いわ]");
  });

  it("renders radicals that sit inside Japanese text", () => {
    expect(render(splitFurigana("亻は人", "にんべんはひと"))).toBe("亻[にんべん]は人[ひと]");
  });

  it("falls back to plain text when the kana cannot be aligned", () => {
    expect(render(splitFurigana("休む", "まったく違う"))).toBe("休む");
  });

  it("returns plain text when no kana is provided", () => {
    expect(render(splitFurigana("休む", ""))).toBe("休む");
  });
});