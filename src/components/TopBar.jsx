import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function TopBar() {
  const { theme, toggleTheme, colors } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time
    .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();

  return (
    <div 
      className="w-full border-b flex items-center justify-between px-4 md:px-6 h-10 z-10 relative"
      style={{ borderColor: colors.border, background: colors.bg }}
    >
      <span className="text-xs tracking-widest font-mono hidden sm:block" style={{ color: colors.textMuted }}>
        IND · {dateStr}
      </span>
      {/* On mobile just show date short */}
      <span className="text-xs tracking-widest font-mono sm:hidden" style={{ color: colors.textMuted }}>
        {dateStr}
      </span>
      <span className="text-xs tracking-widest font-mono font-bold" style={{ color: colors.accent }}>
        ● LIVE
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="text-base hover:opacity-70 transition-opacity px-2 py-1 border rounded"
          style={{ 
            color: colors.textMuted,
            borderColor: colors.border,
            background: colors.bgSecondary
          }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <span className="text-xs tracking-widest font-mono tabular-nums" style={{ color: colors.textMuted }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
}