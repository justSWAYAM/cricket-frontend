import { useTheme } from "../context/ThemeContext";

export default function Background() {
  const { theme, colors } = useTheme();

  return (
    <>
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colors.scanline} 2px, ${colors.scanline} 4px)`,
        }}
      />
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(${colors.borderLight} 1px, transparent 1px), linear-gradient(90deg, ${colors.borderLight} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </>
  );
}
