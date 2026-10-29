import { useCallback, useEffect, useState } from "react";
import type { CalligraphyRepository, StrokePath } from "./repository";
import { calligraphyRepository } from "./repositoryProvider";

type StrokeState =
  | { kanji: string; status: "loading" }
  | { kanji: string; status: "success"; strokes: readonly StrokePath[] }
  | { kanji: string; status: "error"; error: Error };

function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

export function useCalligraphyStrokes(
  kanji: string,
  repository: CalligraphyRepository = calligraphyRepository,
) {
  const [state, setState] = useState<StrokeState>({ kanji, status: "loading" });
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ kanji, status: "loading" });

    void Promise.resolve()
      .then(() => repository.getStrokes(kanji, controller.signal))
      .then((strokes) => {
        if (
          !Array.isArray(strokes) ||
          strokes.length === 0 ||
          strokes.some((path) => typeof path !== "string" || path.trim().length === 0)
        ) {
          throw new Error(`No valid stroke data is available for ${kanji}.`);
        }
        if (active) setState({ kanji, status: "success", strokes });
      })
      .catch((reason: unknown) => {
        if (active && !controller.signal.aborted) {
          setState({ kanji, status: "error", error: toError(reason) });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [kanji, repository, requestNumber]);

  const retry = useCallback(() => setRequestNumber((current) => current + 1), []);
  const stateMatchesKanji = state.kanji === kanji;

  return {
    loading: !stateMatchesKanji || state.status === "loading",
    strokes: stateMatchesKanji && state.status === "success" ? state.strokes : [],
    error: stateMatchesKanji && state.status === "error" ? state.error : null,
    retry,
  };
}
