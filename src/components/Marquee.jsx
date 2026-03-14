import { MARQUEE_TEXT } from "../constants/games";
import { useTheme } from "../context/ThemeContext";

export default function Marquee() {
  const { colors } = useTheme();

  return (
    <div
      className="relative z-10 border-t border-b overflow-hidden h-8 flex items-center mt-8 md:mt-10"
      style={{ 
        borderColor: colors.border,
        background: colors.marquee
      }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 20s linear infinite" }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-xs tracking-widest font-mono pr-10" style={{ color: colors.marqueText }}>
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}