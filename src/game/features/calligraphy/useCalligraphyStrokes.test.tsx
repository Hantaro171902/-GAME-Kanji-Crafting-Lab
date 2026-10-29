import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAPTERS } from "../../data";
import type { CalligraphyRepository } from "./repository";
import { useCalligraphyStrokes } from "./useCalligraphyStrokes";

let root: Root;
let latest: ReturnType<typeof useCalligraphyStrokes>;

function HookHarness({ kanji, repository }: { kanji: string; repository?: CalligraphyRepository }) {
  latest = useCalligraphyStrokes(kanji, repository);
  return null;
}

async function flushEffect() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  root = createRoot(document.createElement("div"));
});

afterEach(() => {
  act(() => root.unmount());
});

describe("useCalligraphyStrokes", () => {
  it("loads the current mock stroke paths for a known kanji", async () => {
    const expected = CHAPTERS.find((chapter) => chapter.kanji.char === "休")?.strokes;

    await act(async () => {
      root.render(createElement(HookHarness, { kanji: "休" }));
      await flushEffect();
    });

    expect(latest.loading).toBe(false);
    expect(latest.strokes).toEqual(expected);
    expect(latest.error).toBeNull();
  });

  it("exposes repository errors and allows retrying", async () => {
    let attempts = 0;
    const repository: CalligraphyRepository = {
      getStrokes: vi.fn(async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("Service unavailable");
        return ["M10 10 L90 90"];
      }),
    };

    await act(async () => {
      root.render(createElement(HookHarness, { kanji: "休", repository }));
      await flushEffect();
    });
    expect(latest.error?.message).toBe("Service unavailable");

    await act(async () => {
      latest.retry();
      await flushEffect();
    });

    expect(repository.getStrokes).toHaveBeenCalledTimes(2);
    expect(latest.strokes).toEqual(["M10 10 L90 90"]);
    expect(latest.error).toBeNull();
  });
});
