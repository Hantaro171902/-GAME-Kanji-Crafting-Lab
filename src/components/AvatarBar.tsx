import avatarBarSvg from "@/assets/new-design/avatar-bar.svg";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/game/i18n";

export type AvatarBarProps = {
  level: number;
  energy: number;
  maxEnergy: number;
  discoveredCount?: number;
  hurt?: boolean;
  onClick?: () => void;
};

export function AvatarBar({
  level,
  energy,
  maxEnergy,
  hurt = false,
  onClick,
}: AvatarBarProps) {
  const t = useT();
  const pct = maxEnergy > 0 ? Math.max(0, Math.min(100, Math.round((energy / maxEnergy) * 100))) : 0;
  const barColor =
    pct <= 25
      ? "[&>div]:bg-red-600"
      : pct <= 50
        ? "[&>div]:bg-amber-500"
        : "[&>div]:bg-[#4b8b55]";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${t("mochiName")} Lv. ${level}, Energy ${energy}/${maxEnergy}`}
      className={`pointer-events-auto relative h-[84px] w-[224px] select-none transition-transform sm:h-[98px] sm:w-[260px] ${
        onClick ? "cursor-pointer hover:scale-[1.02]" : ""
      } ${hurt ? "animate-shake" : ""}`}
    >
      <img
        src={avatarBarSvg}
        alt="Mochi Avatar Bar"
        className="pointer-events-none h-full w-full object-contain drop-shadow-md"
        draggable={false}
      />

      {/* Dynamic overlay positioned inside the right parchment region of avatar-bar.svg */}
      <div className="absolute bottom-[23%] left-[37%] right-[11%] top-[24%] flex flex-col justify-between rounded-md bg-[#f5ead4]/95 px-2 py-0.5">
        <div className="flex items-center justify-between leading-none">
          <span className="font-display text-sm font-bold text-[#4a321f] sm:text-base">
            {t("mochiName")}
          </span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${
              energy <= 1
                ? "bg-red-500/20 text-red-700 animate-pulse"
                : "bg-[#e3d2b4] text-[#5c3e26]"
            }`}
          >
            ⚡ {energy}/{maxEnergy}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold leading-none text-[#5c3e26] sm:text-xs">
          <span>Lv. {level}</span>
        </div>

        <Progress
          value={pct}
          aria-label="Player Energy"
          className={`h-2.5 border border-[#4a321f]/50 bg-[#d8c4a0] shadow-inner [&>div]:transition-all [&>div]:duration-300 ${barColor}`}
        />
      </div>
    </div>
  );
}

export default AvatarBar;
