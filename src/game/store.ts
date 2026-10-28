import { useCallback, useEffect, useState } from "react";
import type { Step } from "./data";

export type Piece = { id: string; char: string };
export type Writing = { id: string; kanji: string; image: string; date: string; favorite: boolean };

export type GameState = {
  /** 0-based index into CHAPTERS. */
  chapter: number;
  step: Step;
  level: number;
  rocks: { rock1: number; rock2: number }; // hits remaining
  pieces: Piece[];
  discovered: string[];
  journal: Writing[];
};

export const SAVE_KEY = "kanji-bento-save-v1";

export const PREF_KEY = "kanji-bento-preferences";

/** Sound effects preference, persisted so the welcome screen can toggle it. */
export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(PREF_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
}

export const FURIGANA_KEY = "kanji-bento-furigana";

/** Whether readings (furigana) are shown above kanji in Japanese text. */
export function isFuriganaEnabled(): boolean {
  try {
    return localStorage.getItem(FURIGANA_KEY) === "on";
  } catch {
    return false;
  }
}

export function setFuriganaEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(FURIGANA_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
}

export const VOLUME_KEY = "kanji-bento-volume";

/** Master volume 0–100, persisted so the settings menu can adjust it. */
export function getVolume(): number {
  try {
    const v = Number(localStorage.getItem(VOLUME_KEY));
    if (Number.isFinite(v)) return Math.max(0, Math.min(100, v));
  } catch {
    /* storage unavailable */
  }
  return 70;
}

export function setVolume(volume: number): void {
  try {
    localStorage.setItem(VOLUME_KEY, String(Math.max(0, Math.min(100, Math.round(volume)))));
  } catch {
    /* storage unavailable */
  }
}

/** Erases saved game progress (used by the welcome screen's Settings). */
export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* storage unavailable */
  }
}

export const initialState: GameState = {
  chapter: 0,
  step: "arrival",
  level: 0,
  rocks: { rock1: 3, rock2: 3 },
  pieces: [],
  discovered: [],
  journal: [],
};

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const update = useCallback((fn: (s: GameState) => GameState) => setState(fn), []);
  const reset = useCallback(() => setState(initialState), []);
  /** Restarts the current chapter: keeps progress, resets the chapter's run. */
  const resetChapter = useCallback(
    () =>
      setState((s) => ({
        ...s,
        step: "arrival",
        rocks: { rock1: 3, rock2: 3 },
        pieces: [],
      })),
    [],
  );
  return { state, update, reset, resetChapter, loaded };
}

let ctx: AudioContext | null = null;
export function sfx(kind: "tap" | "good" | "bad" | "chime" | "dig") {
  if (!isSoundEnabled()) return;
  try {
    ctx ??= new AudioContext();
    const notes: Record<string, [number, number][]> = {
      tap: [[520, 0.06]],
      dig: [[160, 0.08], [120, 0.08]],
      good: [[660, 0.08], [880, 0.12]],
      bad: [[200, 0.15]],
      chime: [[660, 0.1], [880, 0.1], [1175, 0.25]],
    };
    let t = ctx.currentTime;
    const vol = getVolume() / 100;
    for (const [f, d] of notes[kind] ?? []) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = kind === "dig" || kind === "bad" ? "triangle" : "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.15 * vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + d + 0.12);
      t += d;
    }
  } catch {
    /* audio unavailable */
  }
}
