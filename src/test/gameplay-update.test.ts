import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearSave, initialState, useGame } from "@/game/store";
import {
  FRIENDS_DATA,
  INITIAL_CHAT_MESSAGES,
  PLACEMENT_QUIZ,
  RADICALS,
  RANKING_DATA,
} from "@/game/data";

let root: Root;
let latest: ReturnType<typeof useGame>;

function GameHookHarness() {
  latest = useGame();
  return null;
}

describe("Kanji: The Lost World — Gameplay Update", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearSave();
    root = createRoot(document.createElement("div"));
    act(() => {
      root.render(createElement(GameHookHarness));
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.useRealTimers();
  });

  it("initializes store with dual-map state and energy bar values", () => {
    expect(latest.state.currentMap).toBe("village");
    expect(latest.state.isTransitioning).toBe(false);
    expect(latest.state.energy).toBe(initialState.maxEnergy);
    expect(latest.state.maxEnergy).toBe(5);
  });

  it("deducts energy on wrong answers and restores energy on rest", () => {
    act(() => {
      latest.deductEnergy(1);
    });
    expect(latest.state.energy).toBe(4);

    act(() => {
      latest.deductEnergy(10);
    });
    expect(latest.state.energy).toBe(0);

    act(() => {
      latest.restoreEnergy();
    });
    expect(latest.state.energy).toBe(5);
  });

  it("transitions between village and mine maps with an 800ms dark splash screen", () => {
    expect(latest.state.currentMap).toBe("village");

    act(() => {
      latest.changeMap("mine");
    });
    expect(latest.state.isTransitioning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(latest.state.currentMap).toBe("mine");
    expect(latest.state.isTransitioning).toBe(false);
  });

  it("defines multi-size radical shapes, social data, and placement quiz", () => {
    expect(RADICALS["亻"]?.size).toBe("1x3");
    expect(RADICALS["木"]?.size).toBe("2x2");
    expect(RADICALS["一"]?.size).toBe("1x4");
    expect(RADICALS["冂"]?.size).toBe("2x3");
    expect(FRIENDS_DATA.length).toBeGreaterThanOrEqual(4);
    expect(RANKING_DATA.length).toBeGreaterThanOrEqual(4);
    expect(INITIAL_CHAT_MESSAGES.length).toBeGreaterThanOrEqual(3);
    expect(PLACEMENT_QUIZ.length).toBeGreaterThanOrEqual(4);
  });
});
