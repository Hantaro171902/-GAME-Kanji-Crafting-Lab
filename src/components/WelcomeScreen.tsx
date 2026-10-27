import { useEffect, useMemo, useState } from "react";
import Game from "@/game/Game";
import { sfx } from "@/game/store";
import { useT } from "@/game/i18n";
import tanukiImg from "@/assets/tanuki.png";
import mapImg from "@/assets/map.jpg";
import SettingsModal from "@/components/SettingsModal";

/** Kanji glyphs that drift up through the forest like lost words waking. */
const DRIFT_GLYPHS = ["木", "水", "火", "土", "人", "山", "川", "月", "日", "心", "休", "田", "雨", "風"];

type Particle = {
  glyph: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

export default function WelcomeScreen() {
  const t = useT();
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        glyph: DRIFT_GLYPHS[i % DRIFT_GLYPHS.length] ?? "木",
        left: 4 + ((i * 173) % 92), // deterministic spread
        size: 0.9 + ((i * 37) % 10) / 10, // 0.9rem – 1.8rem
        delay: (i % 7) * 1.1,
        duration: 8 + (i % 5) * 2.2,
        opacity: 0.25 + ((i * 53) % 40) / 100,
      })),
    [],
  );

  if (started && mounted) return <Game />;

  return (
    <div className="welcome-root">
      <img src={mapImg} alt="" className="welcome-bg" />
      <div className="welcome-vignette" aria-hidden="true" />

      <div className="welcome-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="welcome-particle"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}rem`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.glyph}
          </span>
        ))}
      </div>

      <main className="welcome-content">
        <img src={tanukiImg} alt="Tanuki mascot" className="welcome-tanuki" />

        <div className="welcome-seal" aria-hidden="true">
          漢字
        </div>

        <h1 className="welcome-title">
          <span className="welcome-word" style={{ "--delay": "0.35s" } as React.CSSProperties}>
            Kanji
          </span>
          <span className="welcome-word" style={{ "--delay": "0.5s" } as React.CSSProperties}>
            The Lost
          </span>
          <span className="welcome-word" style={{ "--delay": "0.65s" } as React.CSSProperties}>
            World
          </span>
        </h1>

        <p className="welcome-sub">言葉の森へようこそ</p>
        <p className="welcome-tagline">{t("tagline")}</p>

        <div className="welcome-actions">
          <button
            className="btn-game btn-accent welcome-btn"
            onClick={() => {
              sfx("chime");
              setStarted(true);
            }}
          >
            <span aria-hidden="true">▶</span> {t("play")}
          </button>
          <button
            className="btn-game btn-ghost welcome-btn"
            onClick={() => {
              sfx("tap");
              setSettingsOpen(true);
            }}
          >
            <span aria-hidden="true">⚙</span> {t("settings")}
          </button>
        </div>
      </main>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}