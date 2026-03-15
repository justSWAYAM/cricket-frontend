import GameCard from "./GameCard";
import { GAMES } from "../constants/games";
import { useTheme } from "../context/ThemeContext";

export default function GameGrid() {
  const { colors } = useTheme();

  return (
    <div className="relative z-10 px-4 md:px-6">
      {/* Divider */}
      <div className="flex items-center mb-4 md:mb-6">
        <div className="flex-1 h-px" style={{ background: colors.border }} />
        <span className="px-3 text-xs tracking-widest font-mono" style={{ color: colors.textMuted }}>
          GAMES — {GAMES.length} AVAILABLE
        </span>
        <div className="flex-1 h-px" style={{ background: colors.border }} />
      </div>

      {/*
        Auto-fit cards by available width.
        With the current 2 games this centers cleanly, and additional games
        will wrap naturally without manual column changes.
      */}
      <div
        className="grid max-w-4xl mx-auto border"
        style={{
          gap: "0",
          borderColor: colors.border,
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        {GAMES.map((game) => (
          <div key={game.id} className="border-b border-r" style={{ borderColor: colors.border }}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}