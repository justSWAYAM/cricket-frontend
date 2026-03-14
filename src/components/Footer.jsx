import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { colors } = useTheme();

  return (
    <div 
      className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-1 px-4 md:px-6 py-4 text-xs tracking-widest font-mono border-t"
      style={{ 
        color: colors.textMuted,
        borderColor: colors.border
      }}
    >
      <span>© 2026 CRICKETXI</span>
      <span className="hidden sm:block">BUILT FOR CRICKET NERDS</span>
      <span>V 0.1</span>
    </div>
  );
}