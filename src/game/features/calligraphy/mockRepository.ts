import { CHAPTERS } from "../../data";
import type { CalligraphyRepository } from "./repository";

export const mockCalligraphyRepository: CalligraphyRepository = {
  async getStrokes(kanji, signal) {
    if (signal?.aborted) {
      throw new DOMException("Stroke request was cancelled.", "AbortError");
    }

    const chapter = CHAPTERS.find((item) => item.kanji.char === kanji);
    if (!chapter || chapter.strokes.length === 0) {
      throw new Error(`No mock stroke data is available for ${kanji}.`);
    }

    return [...chapter.strokes];
  },
};
