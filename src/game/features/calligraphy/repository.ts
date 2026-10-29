export type StrokePath = string;

export interface CalligraphyRepository {
  getStrokes(kanji: string, signal?: AbortSignal): Promise<readonly StrokePath[]>;
}
