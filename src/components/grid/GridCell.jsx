import { useTheme } from "../../context/ThemeContext";
import Logo from "../Logo";

/**
 * GridCell
 * Props:
 *   cellIndex     - 0..8
 *   status        - "empty" | "correct" | "wrong" | "givenup"
 *   player        - player object if correct
 *   hints         - array of hint players if given up
 *   isHighlighted - true if this cell can be selected for current player
 *   onCellClick   - fn(cellIndex) - called when cell is clicked
 */
export default function GridCell({
  cellIndex,
  status,
  player,
  hints = [],
  isHighlighted = false,
  isMultiplayer = false,
  marker = null,
  multiplayerPlayers = { X: "Player X", O: "Player O" },
  onCellClick,
}) {
  const { colors } = useTheme();

  // ── CORRECT ──
  if (status === "correct") {
    const markerColor = marker === "X" ? colors.accent : "#ff8c00";
    const markerOwner = marker ? (multiplayerPlayers[marker] || `Player ${marker}`) : "";
    return (
      <div
        className="relative flex items-center justify-center p-1.5 md:p-2 text-center transition-all duration-200 w-full h-full overflow-hidden"
        style={{
          background: isMultiplayer && marker ? `${markerColor}12` : colors.accentBg,
          border: `1px solid ${isMultiplayer && marker ? markerColor : colors.accentBorder}`,
        }}
      >
        <span
          className="font-mono font-bold leading-tight"
          style={{
            color: isMultiplayer && marker ? markerColor : colors.accent,
            fontSize: "clamp(11px, 2.8vw, 24px)",
            maxWidth: "100%",
            textWrap: "balance",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.05,
            letterSpacing: "0.02em",
          }}
        >
          {player.name}
        </span>
        {isMultiplayer && marker && (
          <span
            className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-mono tracking-wide border"
            style={{
              borderColor: markerColor,
              color: markerColor,
              background: `${markerColor}12`,
            }}
            title={`Marked by ${marker} (${markerOwner})`}
          >
            {marker} ({markerOwner})
          </span>
        )}
      </div>
    );
  }

  // ── WRONG — red flash ──
  if (status === "wrong") {
    return (
      <div
        className="flex items-center justify-center p-3 transition-all duration-200 w-full h-full"
        style={{
          background: "rgba(255,60,60,0.1)",
          border: "1px solid rgba(255,60,60,0.4)",
          animation: "shake 0.4s ease",
        }}
      >
        <span className="text-2xl font-mono" style={{ color: "#ff3c3c" }}>✗</span>
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20% { transform: translateX(-4px); }
            40% { transform: translateX(4px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
        `}</style>
      </div>
    );
  }

  // ── GIVEN UP — show possible answers ──
  if (status === "givenup") {
    return (
      <div
        className="flex items-center justify-center p-3 text-center transition-all duration-200 overflow-hidden w-full h-full"
        style={{
          background: "rgba(255,165,0,0.05)",
          border: `1px solid rgba(255,165,0,0.3)`,
        }}
      >
        <div className="flex flex-col gap-1.5">
          {hints.slice(0, 3).map((hint, i) => {
            // hint can be a player object {name:...} or a plain string
            const displayName = typeof hint === "string"
              ? hint.replace(/\b\w/g, (c) => c.toUpperCase())
              : hint.name;
            return (
              <span
                key={i}
                className="text-xs font-mono leading-tight"
                style={{ color: colors.text, opacity: 0.7 }}
              >
                {displayName}
              </span>
            );
          })}
          {hints.length > 3 && (
            <span
              className="text-[10px] font-mono"
              style={{ color: colors.text, opacity: 0.6 }}
            >
              +{hints.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── EMPTY — highlighted for selection ──
  if (isHighlighted) {
    return (
      <div
        onClick={() => onCellClick(cellIndex)}
        className="flex items-center justify-center cursor-pointer transition-all duration-150 w-full h-full"
        style={{
          background: colors.accentBg,
          border: `2px solid ${colors.accent}`,
          boxShadow: `0 0 12px ${colors.accent}40`,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        <div className="md:hidden">
          <Logo size="md" variant="xi" />
        </div>
        <div className="hidden md:block">
          <Logo size="lg" variant="xi" />
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  // ── EMPTY — default state (not clickable in new design) ──
  return (
    <div
      className="flex items-center justify-center transition-all duration-150 w-full h-full"
      style={{
        background: colors.bgSecondary,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="md:hidden">
        <Logo size="md" variant="xi" />
      </div>
      <div className="hidden md:block">
        <Logo size="lg" variant="xi" />
      </div>
    </div>
  );
}