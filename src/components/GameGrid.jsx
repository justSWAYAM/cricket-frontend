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
        Mobile: 3 columns (compact cards)
        Desktop (md+): 2 columns (larger cards)
      */}
      <div
        className="grid grid-cols-3 md:grid-cols-2 max-w-4xl mx-auto border"
        style={{ gap: "0", borderColor: colors.border }}
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