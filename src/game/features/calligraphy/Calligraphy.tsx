import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Chapter } from "../../data";
import { sfx, type Writing } from "../../store";
import { useT } from "../../i18n";
import { Modal } from "../../components/Modal";
import { JournalStrip } from "../../components/JournalStrip";
import { StrokeDemo } from "./StrokeDemo";
import { useCalligraphyStrokes } from "./useCalligraphyStrokes";

export function Calligraphy({
  chapter,
  onSave,
  onClose,
  journal,
  onToggleFav,
}: {
  chapter: Chapter;
  onSave: (img: string, fav: boolean) => void;
  onClose: () => void;
  journal: Writing[];
  onToggleFav: (id: string) => void;
}) {
  const t = useT();
  const kanji = chapter.kanji;
  const { strokes, loading, error, retry } = useCalligraphyStrokes(kanji.char);
  const ready = !loading && !error && strokes.length > 0;
  const [mode, setMode] = useState<"trace" | "free">("trace");
  const [strokeCount, setStrokeCount] = useState(0);
  const [showRef, setShowRef] = useState(true);
  const [fav, setFav] = useState(false);
  const [saved, setSaved] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const history = useRef<ImageData[]>([]);
  const traceDone = ready && strokeCount >= strokes.length;

  const clear = useCallback(() => {
    const currentCanvas = canvas.current;
    const context = currentCanvas?.getContext("2d");
    if (!currentCanvas || !context) return;
    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    history.current = [];
    setStrokeCount(0);
  }, []);

  useEffect(clear, [clear, mode]);

  const pos = (event: PointerEvent<HTMLCanvasElement>) => {
    const bounds = canvas.current!.getBoundingClientRect();
    return [
      ((event.clientX - bounds.left) / bounds.width) * 400,
      ((event.clientY - bounds.top) / bounds.height) * 400,
    ] as const;
  };
  const down = (event: PointerEvent<HTMLCanvasElement>) => {
    const currentCanvas = canvas.current!;
    const context = currentCanvas.getContext("2d")!;
    history.current.push(context.getImageData(0, 0, 400, 400));
    drawing.current = true;
    currentCanvas.setPointerCapture(event.pointerId);
    const [x, y] = pos(event);
    context.strokeStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "black";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 22;
    context.beginPath();
    context.moveTo(x, y);
  };
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = canvas.current!.getContext("2d")!;
    const [x, y] = pos(event);
    context.lineWidth = Math.max(
      10,
      Math.min(26, 26 - Math.hypot(event.movementX, event.movementY) * 0.6),
    );
    context.lineTo(x, y);
    context.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setStrokeCount((current) => current + 1);
    sfx("tap");
  };
  const undo = () => {
    const last = history.current.pop();
    if (last) {
      canvas.current!.getContext("2d")!.putImageData(last, 0, 0);
      setStrokeCount((current) => Math.max(0, current - 1));
    }
  };
  const save = () => {
    onSave(canvas.current!.toDataURL("image/png"), fav);
    setSaved(true);
    sfx("chime");
  };

  const currentStroke = Math.min(strokeCount, strokes.length - 1);

  return (
    <Modal title={t("deskTitle")} onClose={onClose} wide>
      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <button
              className={`btn-game px-4 py-1 ${mode === "trace" ? "" : "btn-ghost"}`}
              onClick={() => setMode("trace")}
            >
              {t("trace")}
            </button>
            <button
              className={`btn-game px-4 py-1 ${mode === "free" ? "" : "btn-ghost"}`}
              onClick={() => setMode("free")}
              disabled={!traceDone && mode === "trace"}
            >
              {t("freeWrite")}
            </button>
          </div>
          <div className="relative h-[min(52vh,340px)] w-[min(52vh,340px)] rounded-xl border-4 border-wood bg-paper">
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <line
                x1="50"
                y1="0"
                x2="50"
                y2="100"
                className="stroke-border"
                strokeDasharray="2 3"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                className="stroke-border"
                strokeDasharray="2 3"
                strokeWidth="0.5"
              />
              {(mode === "trace" || showRef) && (
                <text
                  x="50"
                  y="53"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-muted-foreground/10 font-kanji select-none"
                  fontSize="82"
                >
                  {kanji.char}
                </text>
              )}
              {ready &&
                (mode === "trace" || showRef) &&
                strokes.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6.5"
                    className={
                      mode === "trace" && index === currentStroke && !traceDone
                        ? "stroke-accent/75"
                        : "stroke-muted-foreground/25"
                    }
                  />
                ))}
              {ready &&
                mode === "trace" &&
                !traceDone &&
                (() => {
                  const match = (strokes[currentStroke] ?? "").match(
                    /M(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/,
                  ) ?? ["", "0", "0"];
                  return (
                    <g>
                      <circle
                        cx={match[1]}
                        cy={match[2]}
                        r="3.8"
                        className="fill-accent animate-glow"
                      />
                      <text
                        x={Number(match[1]) + 5}
                        y={Number(match[2]) - 4}
                        className="fill-accent font-bold"
                        fontSize="7"
                      >
                        {currentStroke + 1}
                      </text>
                    </g>
                  );
                })()}
            </svg>
            <canvas
              ref={canvas}
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full touch-none"
              onPointerDown={ready ? down : undefined}
              onPointerMove={ready ? move : undefined}
              onPointerUp={up}
              onPointerLeave={up}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="btn-game btn-ghost px-3 py-1" onClick={undo} disabled={!ready}>
              {t("undo")}
            </button>
            <button className="btn-game btn-ghost px-3 py-1" onClick={clear}>
              {t("clear")}
            </button>
            {mode === "free" && (
              <button
                className="btn-game btn-ghost px-3 py-1"
                onClick={() => setShowRef((current) => !current)}
              >
                {showRef ? t("hideGuide") : t("showGuide")}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {loading && <p role="status">{t("loadingStrokeData")}</p>}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive bg-destructive/10 p-3"
            >
              <p>{t("strokeDataLoadError")}</p>
              <button className="btn-game btn-ghost mt-2" onClick={retry}>
                {t("retry")}
              </button>
            </div>
          )}
          {ready && mode === "trace" && (
            <>
              <p>
                {t("followStroke", {
                  cur: Math.min(strokeCount + 1, strokes.length),
                  total: strokes.length,
                })}
              </p>
              <StrokeDemo strokes={strokes} size={140} />
              {traceDone && (
                <button className="btn-game btn-accent animate-pop" onClick={() => setMode("free")}>
                  {t("greatNowWrite")}
                </button>
              )}
            </>
          )}
          {ready && mode === "free" && (
            <>
              <p>
                {t("writeFromMemory", {
                  char: kanji.char,
                  cur: strokeCount,
                  total: strokes.length,
                })}
              </p>
              <label className="flex items-center gap-2">
                <button
                  className={`btn-game px-3 py-1 ${fav ? "btn-accent" : "btn-ghost"}`}
                  onClick={() => setFav((current) => !current)}
                >
                  {fav ? t("favoriteOn") : t("favoriteOff")}
                </button>
              </label>
              <button
                className="btn-game"
                disabled={strokeCount < strokes.length || saved}
                onClick={save}
              >
                {saved ? t("savedToJournal") : t("saveToJournal")}
              </button>
              {saved && (
                <button className="btn-game btn-accent animate-pop" onClick={onClose}>
                  {t("returnToForest")}
                </button>
              )}
            </>
          )}
          {journal.length > 0 && <JournalStrip journal={journal} onToggleFav={onToggleFav} />}
        </div>
      </div>
    </Modal>
  );
}
