import { useEffect, useState } from "react";
import type { StrokePath } from "./repository";

export function StrokeDemo({
  strokes,
  size = 220,
  loop = true,
}: {
  strokes: readonly StrokePath[];
  size?: number;
  loop?: boolean;
}) {
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    if (!loop || strokes.length === 0) return;
    const timer = setInterval(
      () => setIteration((current) => current + 1),
      strokes.length * 700 + 1200,
    );
    return () => clearInterval(timer);
  }, [loop, strokes.length]);

  return (
    <svg
      key={iteration}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="rounded-xl bg-paper"
    >
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="100"
        className="stroke-border"
        strokeDasharray="2 3"
        strokeWidth="0.6"
      />
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        className="stroke-border"
        strokeDasharray="2 3"
        strokeWidth="0.6"
      />
      {strokes.map((path, index) => (
        <path
          key={index}
          d={path}
          pathLength={1}
          fill="none"
          className="stroke-ink"
          strokeWidth="7"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animation: `draw-stroke 0.6s ease-out ${index * 0.7}s forwards`,
          }}
        />
      ))}
    </svg>
  );
}
