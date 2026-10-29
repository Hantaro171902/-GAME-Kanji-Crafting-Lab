import type { Writing } from "../store";
import { useT } from "../i18n";

export function JournalStrip({
  journal,
  onToggleFav,
}: {
  journal: Writing[];
  onToggleFav: (id: string) => void;
}) {
  const t = useT();
  return (
    <div>
      <h3 className="mb-1 font-bold text-wood">{t("memoryJournal")}</h3>
      <div className="flex flex-wrap gap-2">
        {journal.map((writing) => (
          <div key={writing.id} className="relative">
            <img
              src={writing.image}
              alt={`Your ${writing.kanji}`}
              className="h-20 w-20 rounded-lg border-2 border-wood bg-paper"
            />
            <button
              onClick={() => onToggleFav(writing.id)}
              className="absolute -right-1 -top-1 rounded-full bg-card px-1 text-accent"
              aria-label={t("toggleFavorite")}
            >
              {writing.favorite ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
