import { useState } from "react";
import { clearSave, isSoundEnabled, setSoundEnabled, sfx, getVolume, setVolume, isFuriganaEnabled, setFuriganaEnabled } from "@/game/store";
import { LANGS, setLang, useLang, useT, type Lang } from "@/game/i18n";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const [sound, setSound] = useState(isSoundEnabled());
  const [furigana, setFurigana] = useState(isFuriganaEnabled());
  const [volume, setVol] = useState(getVolume());
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setSound(enabled);
    if (enabled) sfx("tap");
  };

  const toggleFurigana = (enabled: boolean) => {
    setFuriganaEnabled(enabled);
    setFurigana(enabled);
    sfx("tap");
  };

  const changeVolume = (v: number) => {
    setVol(v);
    setVolume(v);
  };

  const changeLang = (l: Lang) => {
    setLang(l);
    sfx("tap");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="panel modal-card animate-pop"
        role="dialog"
        aria-modal="true"
        aria-label={t("settings")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <span className="title-tab">
            <span aria-hidden="true">⚙</span> {t("settings")}
          </span>
          <button className="modal-close" onClick={onClose} aria-label={t("close")}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="setting-row">
            <span className="setting-label">{t("language")}</span>
            <div className="lang-picker" role="radiogroup" aria-label={t("language")}>
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  role="radio"
                  aria-checked={lang === l.id}
                  className={`btn-game btn-small${lang === l.id ? " btn-accent" : " btn-ghost"}`}
                  onClick={() => changeLang(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {lang === "ja" && (
            <div className="setting-row">
              <span className="setting-label">{t("furigana")}</span>
              <button
                role="switch"
                aria-checked={furigana}
                aria-label={t("furigana")}
                className={`switch${furigana ? " on" : ""}`}
                onClick={() => toggleFurigana(!furigana)}
              >
                <span className="switch-knob" />
              </button>
            </div>
          )}

          <div className="setting-row">
            <span className="setting-label">{t("sound")}</span>
            <button
              role="switch"
              aria-checked={sound}
              aria-label={t("sound")}
              className={`switch${sound ? " on" : ""}`}
              onClick={() => toggleSound(!sound)}
            >
              <span className="switch-knob" />
            </button>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t("volume")}</span>
            <div className="volume-control">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={volume}
                aria-label={t("volume")}
                onChange={(e) => changeVolume(Number(e.target.value))}
                onMouseUp={() => sfx("tap")}
                onTouchEnd={() => sfx("tap")}
              />
              <span className="volume-value">{volume}%</span>
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t("progress")}</span>
            {confirmReset ? (
              <div className="reset-confirm">
                <span className="reset-warning">{t("eraseAll")}</span>
                <button
                  className="btn-danger"
                  onClick={() => {
                    clearSave();
                    sfx("bad");
                    onClose();
                  }}
                >
                  {t("yesErase")}
                </button>
                <button className="btn-ghost btn-small" onClick={() => setConfirmReset(false)}>
                  {t("keep")}
                </button>
              </div>
            ) : (
              <button
                className="btn-danger"
                onClick={() => {
                  sfx("tap");
                  setConfirmReset(true);
                }}
              >
                {t("resetProgress")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}