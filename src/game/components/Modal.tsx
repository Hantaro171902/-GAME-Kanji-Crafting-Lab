import type { ReactNode } from "react";
import { useT } from "../i18n";

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const t = useT();
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[2px]">
      <div
        className={`panel animate-pop relative max-h-full w-full overflow-auto p-5 ${wide ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-wood">{title}</h2>
          {onClose && (
            <button
              className="btn-game btn-ghost px-3 py-1"
              onClick={onClose}
              aria-label={t("close")}
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
