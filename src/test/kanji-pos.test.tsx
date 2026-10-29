import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CHAPTERS, EXTRA_KANJI, POS_LABELS, lookupKanji, type PartOfSpeech } from "@/game/data";
import { KanjiPopup } from "@/game/components/KanjiPopup";
import { ClickableKanjiText } from "@/game/components/ClickableKanjiText";

const VALID_POS: PartOfSpeech[] = ["noun", "verb", "i-adjective", "na-adjective", "adverb"];

describe("Kanji Word-Type Popup — data integrity", () => {
  it("assigns at least one valid part of speech to every chapter kanji", () => {
    for (const ch of CHAPTERS) {
      expect(ch.kanji.pos.length).toBeGreaterThanOrEqual(1);
      for (const p of ch.kanji.pos) {
        expect(VALID_POS).toContain(p);
      }
    }
  });

  it("provides localized labels for every part of speech", () => {
    for (const p of VALID_POS) {
      const label = POS_LABELS[p];
      expect(label.en.length).toBeGreaterThan(0);
      expect(label.ja.length).toBeGreaterThan(0);
      expect(label.vi.length).toBeGreaterThan(0);
    }
  });

  it("assigns expected primary word types to the six chapter kanji", () => {
    const byChar = Object.fromEntries(CHAPTERS.map((c) => [c.kanji.char, c.kanji.pos]));
    expect(byChar["休"]).toContain("verb");
    expect(byChar["明"]).toContain("i-adjective");
    expect(byChar["岩"]).toEqual(["noun"]);
    expect(byChar["時"]).toEqual(["noun"]);
    expect(byChar["男"]).toEqual(["noun"]);
    expect(byChar["雪"]).toEqual(["noun"]);
  });
});

describe("KanjiPopup", () => {
  it("renders word type, on/kun readings and localized meaning", () => {
    const kyu = CHAPTERS.find((c) => c.kanji.char === "休")!.kanji;
    render(<KanjiPopup kanji={kyu} x={100} y={100} onClose={() => {}} />);

    expect(screen.getByText("休")).toBeInTheDocument();
    expect(screen.getByText("Rest")).toBeInTheDocument();
    expect(screen.getByText("Noun")).toBeInTheDocument();
    expect(screen.getByText("Verb")).toBeInTheDocument();
    expect(screen.getByText(/キュウ/)).toBeInTheDocument();
    expect(screen.getByText(/やす・む/)).toBeInTheDocument();
  });
});

describe("lookupKanji", () => {
  it("resolves chapter kanji first, then the extra dictionary", () => {
    expect(lookupKanji("休")?.pos).toContain("verb");
    expect(lookupKanji("時")?.pos).toEqual(["noun"]);
    expect(lookupKanji("日")?.pos).toEqual(["noun"]);
    expect(lookupKanji("寺")?.pos).toEqual(["noun"]);
    expect(lookupKanji("寝")?.pos).toEqual(["verb"]);
    expect(lookupKanji("無")).toBeUndefined();
  });

  it("keeps every extra kanji entry valid and localized", () => {
    for (const [char, entry] of Object.entries(EXTRA_KANJI)) {
      expect(entry.char).toBe(char);
      expect(entry.pos.length).toBeGreaterThanOrEqual(1);
      for (const p of entry.pos) expect(["noun", "verb", "i-adjective", "na-adjective", "adverb"]).toContain(p);
      expect(entry.meaning.en.length).toBeGreaterThan(0);
      expect(entry.meaning.ja.length).toBeGreaterThan(0);
      expect(entry.meaning.vi.length).toBeGreaterThan(0);
    }
  });
});

describe("ClickableKanjiText", () => {
  it("renders known kanji as clickable and unknown kanji as plain text", () => {
    render(
      <ClickableKanjiText
        jp="休日と寺"
        onInspect={() => {}}
      />,
    );
    const clickable = screen.getAllByRole("button");
    const texts = clickable.map((n: HTMLElement) => n.textContent);
    expect(texts).toContain("休");
    expect(texts).toContain("日");
    expect(texts).toContain("寺");
    expect(screen.getByText("と")).toBeInTheDocument();
  });
});