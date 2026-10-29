import { useCallback, useEffect, useState } from "react";
import type { RadicalShape, Step } from "./data";

export type MapName = "village" | "mine";

export type Piece = {
  id: string;
  char: string;
  size?: RadicalShape;
  discoveredAt?: string;
};

export type Writing = {
  id: string;
  kanji: string;
  image: string;
  date: string;
  favorite: boolean;
};

export type GameState = {
  /** 0-based index into CHAPTERS. */
  chapter: number;
  step: Step;
  level: number;
  currentMap: MapName;
  isTransitioning: boolean;
  energy: number;
  maxEnergy: number;
  assessed: boolean;
  rocks: { rock1: number; rock2: number }; // hits remaining
  /** Chapter ID -> list of excavated "row,col" cells in the Radical Mine grid */
  excavatedCells: Record<string, string[]>;
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

export const initialState: GameState = {
  chapter: 0,
  step: "arrival",
  level: 0,
  currentMap: "village",
  isTransitioning: false,
  energy: 5,
  maxEnergy: 5,
  assessed: false,
  rocks: { rock1: 3, rock2: 3 },
  excavatedCells: {},
  pieces: [],
  discovered: [],
  journal: [],
};

// Shared module store so all components reading useGame() stay synchronized.
let sharedState: GameState = initialState;
let hydrated = false;
let transitionTimer: ReturnType<typeof setTimeout> | null = null;
const storeListeners = new Set<() => void>();

function notifyStore() {
  storeListeners.forEach((fn) => fn());
}

function persistState(next: GameState) {
  try {
    const toSave = { ...next, isTransitioning: false };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    /* storage unavailable */
  }
}

export function getGameState(): GameState {
  return sharedState;
}

export function setGameState(updater: GameState | ((prev: GameState) => GameState)): void {
  const next = typeof updater === "function" ? updater(sharedState) : updater;
  sharedState = next;
  if (hydrated) persistState(next);
  notifyStore();
}

/** Erases saved game progress (used by the welcome screen's Settings). */
export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* storage unavailable */
  }
  sharedState = initialState;
  notifyStore();
}

export function useGame() {
  const [state, setState] = useState<GameState>(sharedState);
  const [loaded, setLoaded] = useState(hydrated);

  useEffect(() => {
    if (!hydrated) {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          sharedState = {
            ...initialState,
            ...parsed,
            isTransitioning: false,
            energy: typeof parsed.energy === "number" ? parsed.energy : initialState.energy,
            maxEnergy: typeof parsed.maxEnergy === "number" ? parsed.maxEnergy : initialState.maxEnergy,
            currentMap: parsed.currentMap === "mine" ? "mine" : "village",
            excavatedCells: parsed.excavatedCells ?? {},
          };
        }
      } catch {
        /* ignore */
      }
      hydrated = true;
      setState(sharedState);
    }
    setLoaded(true);

    const listener = () => setState(sharedState);
    storeListeners.add(listener);
    return () => {
      storeListeners.delete(listener);
    };
  }, []);

  const update = useCallback((fn: (s: GameState) => GameState) => {
    setGameState(fn);
  }, []);

  const reset = useCallback(() => {
    if (transitionTimer) clearTimeout(transitionTimer);
    setGameState(initialState);
  }, []);

  /** Restarts the current chapter: keeps progress, resets the chapter's run. */
  const resetChapter = useCallback(() => {
    setGameState((s) => ({
      ...s,
      step: "arrival",
      currentMap: "village",
      isTransitioning: false,
      energy: s.maxEnergy,
      rocks: { rock1: 3, rock2: 3 },
      excavatedCells: {},
      pieces: [],
    }));
  }, []);

  /** Phase 1: Smooth 800ms dark splash transition between 'village' and 'mine'. */
  const changeMap = useCallback((mapName: MapName) => {
    if (sharedState.currentMap === mapName || sharedState.isTransitioning) return;
    sfx("tap");
    setGameState((s) => ({ ...s, isTransitioning: true }));
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      setGameState((s) => ({
        ...s,
        currentMap: mapName,
        isTransitioning: false,
      }));
    }, 800);
  }, []);

  /** Phase 3: Deduct energy upon wrong answer in Kanji Bento / Shrine. */
  const deductEnergy = useCallback((amount = 1) => {
    setGameState((s) => ({
      ...s,
      energy: Math.max(0, s.energy - amount),
    }));
  }, []);

  /** Restores player energy to full after resting. */
  const restoreEnergy = useCallback(() => {
    sfx("chime");
    setGameState((s) => ({
      ...s,
      energy: s.maxEnergy,
    }));
  }, []);

  return {
    state,
    update,
    reset,
    resetChapter,
    changeMap,
    deductEnergy,
    restoreEnergy,
    loaded,
  };
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
