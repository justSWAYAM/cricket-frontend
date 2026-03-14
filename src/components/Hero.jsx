import { useTheme } from "../context/ThemeContext";

export default function Hero() {
  const { colors } = useTheme();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center pt-8 md:pt-12 pb-6 md:pb-8 px-4 text-center">

      {/* Label */}
      <div 
        className="border px-3 md:px-4 py-1 text-xs tracking-widest mb-6 md:mb-8 font-mono"
        style={{ 
          borderColor: colors.borderSecondary,
          color: colors.textMuted,
          background: colors.bgSecondary
        }}
      >
        DAILY CRICKET PUZZLE GAMES
      </div>

      {/* Site name */}
      <div className="relative mb-3 md:mb-4">
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight uppercase font-sans"
          style={{ color: colors.text }}
        >
          CRICKET
        </h1>
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight uppercase font-sans"
          style={{ color: "transparent", WebkitTextStroke: `2px ${colors.accent}` }}
        >
          XI
        </h1>
        <div
          className="absolute w-2 h-2 md:w-2.5 md:h-2.5"
          style={{ background: colors.accent, top: "6px", right: "-10px" }}
        />
      </div>

      <p className="text-xs tracking-widest font-mono mt-2 px-4 leading-relaxed" style={{ color: colors.textMuted }}>
        TEST YOUR CRICKET IQ · DAILY PUZZLES · COMPETE WITH FRIENDS
      </p>
    </div>
  );
}