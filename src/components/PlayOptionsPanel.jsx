import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function PlayOptionsPanel({
  isMultiplayer,
  setClassicMode,
  setMultiplayerMode,
  useTurnTimer,
  toggleTurnTimer,
  customTime,
  onCustomTimeChange,
  currentTurn,
  xPlayerName,
  oPlayerName,
  multiplayerStarted,
  timeLeft,
  multiplayerResult,
  onPrimaryAction,
}) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });

  return (
    <div
      className="w-full font-mono"
      style={{ border: `1px solid ${colors.border}`, background: colors.bgSecondary }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-3 py-2 border-b flex items-center justify-between text-left"
        style={{ borderColor: colors.border }}
      >
        <span className="text-xs tracking-widest font-bold" style={{ color: colors.textSecondary }}>
          PLAY OPTIONS
        </span>
        <span className="text-[10px] tracking-widest" style={{ color: colors.textMuted }}>
          {isOpen ? "TAP TO MINIMIZE" : "TAP TO OPEN"}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="p-3 border-b flex gap-2" style={{ borderColor: colors.border }}>
            <button
              onClick={setClassicMode}
              className="flex-1 px-2 py-2 text-[10px] tracking-widest border"
              style={{
                borderColor: colors.border,
                color: !isMultiplayer ? colors.accent : colors.textMuted,
                background: !isMultiplayer ? colors.accentBg : colors.bg,
              }}
            >
              CLASSIC
            </button>
            <button
              onClick={setMultiplayerMode}
              className="flex-1 px-2 py-2 text-[10px] tracking-widest border"
              style={{
                borderColor: colors.border,
                color: isMultiplayer ? colors.accent : colors.textMuted,
                background: isMultiplayer ? colors.accentBg : colors.bg,
              }}
            >
              MULTIPLAYER
            </button>
          </div>

          <div className="p-3 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest" style={{ color: colors.textMuted }}>
                TURN TIMER
              </span>
              <button
                onClick={toggleTurnTimer}
                className="px-2 py-1 text-[10px] tracking-widest border"
                style={{
                  borderColor: colors.border,
                  color: useTurnTimer ? colors.accent : colors.textMuted,
                  background: useTurnTimer ? colors.accentBg : colors.bg,
                }}
              >
                {useTurnTimer ? "ON" : "OFF"}
              </button>
            </div>

            {useTurnTimer && (
              <div className="mt-3">
                <label className="text-[10px] tracking-widest" style={{ color: colors.textMuted }}>
                  PER TURN (SEC)
                </label>
                <input
                  type="number"
                  min="1"
                  value={customTime}
                  onChange={(e) => onCustomTimeChange(e.target.value)}
                  className="mt-1 w-full px-2 py-2 text-[11px] font-mono border"
                  style={{ borderColor: colors.border, background: colors.bg, color: colors.textSecondary }}
                />
              </div>
            )}
          </div>

          <div className="p-3 border-b" style={{ borderColor: colors.border }}>
            <div className="text-[10px] tracking-widest" style={{ color: colors.textMuted }}>
              RESULT
            </div>
            {isMultiplayer ? (
              <>
                <div className="mt-2 text-sm font-bold" style={{ color: currentTurn === "X" ? colors.accent : "#ff8c00" }}>
                  TURN: {currentTurn} ({currentTurn === "X" ? xPlayerName : oPlayerName})
                </div>
                <div className="mt-1 text-xs" style={{ color: colors.textMuted }}>
                  GAME: {multiplayerStarted ? "STARTED" : "NOT STARTED"}
                </div>
                <div className="mt-1 text-[11px]" style={{ color: colors.textMuted }}>
                  X: {xPlayerName}
                </div>
                <div className="text-[11px]" style={{ color: colors.textMuted }}>
                  O: {oPlayerName}
                </div>
                {useTurnTimer && !multiplayerResult && (
                  <div className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
                    TIME LEFT: {timeLeft}s
                  </div>
                )}
                {multiplayerResult && (
                  <div className="mt-2 text-xs font-bold tracking-widest" style={{ color: colors.accent }}>
                    {multiplayerResult}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-2 text-xs" style={{ color: colors.textMuted }}>
                CLASSIC GRID MODE ACTIVE
              </div>
            )}
          </div>

          <div className="p-3">
            <button
              onClick={onPrimaryAction}
              className="w-full px-3 py-2 text-[10px] tracking-widest border"
              style={{ borderColor: colors.border, color: colors.textSecondary, background: colors.bg }}
            >
              {isMultiplayer ? "START MULTIPLAYER" : "NEW GAME"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
