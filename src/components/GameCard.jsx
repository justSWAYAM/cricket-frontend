import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// ── Visual previews as inline SVG ──────────────────────────

function GridPreview({ colors, accent }) {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="120" fill={colors.bgTertiary}/>
      <line x1="20" y1="30" x2="155" y2="30" stroke={colors.border} strokeWidth="1"/>
      <line x1="20" y1="30" x2="20" y2="115" stroke={colors.border} strokeWidth="1"/>
      <rect x="65" y="10" width="26" height="16" rx="0" fill="#1a3a6b" stroke="#2255aa" strokeWidth="1"/>
      <text x="78" y="22" textAnchor="middle" fill="#4488ff" fontSize="7" fontFamily="monospace" fontWeight="bold">MI</text>
      <rect x="110" y="10" width="26" height="16" rx="0" fill="#3a1a1a" stroke="#aa2222" strokeWidth="1"/>
      <text x="123" y="22" textAnchor="middle" fill="#ff4444" fontSize="7" fontFamily="monospace" fontWeight="bold">RCB</text>
      <rect x="2" y="37" width="14" height="22" rx="0" fill={colors.bgSecondary} stroke={colors.borderSecondary} strokeWidth="1"/>
      <text x="9" y="43" textAnchor="middle" fill={colors.textGray} fontSize="5" fontFamily="monospace">IN</text>
      <rect x="3" y="44" width="12" height="3" fill="#ff9933"/>
      <rect x="3" y="47" width="12" height="3" fill="#f0f0f0"/>
      <rect x="3" y="50" width="12" height="3" fill="#138808"/>
      <rect x="2" y="68" width="14" height="22" rx="0" fill={colors.bgSecondary} stroke={colors.borderSecondary} strokeWidth="1"/>
      <text x="9" y="74" textAnchor="middle" fill={colors.textGray} fontSize="5" fontFamily="monospace">SA</text>
      <rect x="3" y="75" width="12" height="5" fill="#007A4D"/>
      <rect x="3" y="80" width="12" height="5" fill="#FFB612"/>
      <rect x="3" y="85" width="12" height="5" fill="#001489"/>
      <rect x="2" y="99" width="14" height="14" rx="0" fill={colors.bgSecondary} stroke={colors.borderSecondary} strokeWidth="1"/>
      <text x="9" y="108" textAnchor="middle" fill={colors.textGray} fontSize="5" fontFamily="monospace">AU</text>
      {[37, 68, 99].map((y, ri) =>
        [65, 110].map((x, ci) => (
          <g key={`${ri}-${ci}`}>
            <rect x={x} y={y} width="40" height="26" fill={ri === 0 && ci === 0 ? colors.accentBgHover : colors.bgSecondary} stroke={colors.border} strokeWidth="1"/>
            <circle cx={x + 20} cy={y + 9} r="5" fill={ri === 0 && ci === 0 ? `${accent}55` : colors.watermark}/>
            <rect x={x + 13} y={y + 15} width="14" height="8" rx="0" fill={ri === 0 && ci === 0 ? `${accent}33` : colors.bgSecondary}/>
            {ri === 0 && ci === 0 && (
              <text x={x + 20} y={y + 24} textAnchor="middle" fill={accent} fontSize="5" fontFamily="monospace" fontWeight="bold">✓</text>
            )}
          </g>
        ))
      )}
      <text x="80" y="115" textAnchor="middle" fill={colors.textDisabled} fontSize="6" fontFamily="monospace" letterSpacing="2">CRICKET GRID</text>
    </svg>
  );
}

function Top10Preview({ colors, accent }) {
  const bars = [
    { label: "KOHLI", val: 100, color: accent },
    { label: "ROHIT", val: 85, color: colors.theme === "dark" ? "#00cc6a" : "#00aa55" },
    { label: "SACHIN", val: 78, color: colors.theme === "dark" ? "#009a50" : "#008844" },
    { label: "DHONI", val: 70, color: colors.textDarkGray },
    { label: "WARNER", val: 60, color: colors.watermark },
  ];

  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="120" fill={colors.bgTertiary}/>
      <text x="80" y="14" textAnchor="middle" fill={colors.textDisabled} fontSize="7" fontFamily="monospace" letterSpacing="2">TOP RUN SCORERS</text>
      <line x1="10" y1="18" x2="150" y2="18" stroke={colors.border} strokeWidth="1"/>
      {bars.map((b, i) => (
        <g key={i}>
          <text x="14" y={32 + i * 18} textAnchor="middle" fill={i < 3 ? accent : colors.textDisabled} fontSize="7" fontFamily="monospace" fontWeight="bold">{i + 1}</text>
          <text x="26" y={32 + i * 18} fill={i < 3 ? colors.textGray : colors.textDisabled} fontSize="6" fontFamily="monospace">{b.label}</text>
          <rect x="72" y={24 + i * 18} width="78" height="8" fill={colors.bgSecondary} stroke={colors.border} strokeWidth="1"/>
          <rect x="72" y={24 + i * 18} width={b.val * 0.78} height="8" fill={b.color}/>
          {i >= 3 && (
            <text x="108" y={32 + i * 18} textAnchor="middle" fill={colors.textDisabled} fontSize="7" fontFamily="monospace">???</text>
          )}
        </g>
      ))}
      <text x="80" y="115" textAnchor="middle" fill={colors.textDisabled} fontSize="6" fontFamily="monospace" letterSpacing="2">TOP 10</text>
    </svg>
  );
}

const PREVIEWS = {
  grid: GridPreview,
  top10: Top10Preview,
};

// ── Game Card ──────────────────────────────────────────────

export default function GameCard({ game }) {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const Preview = PREVIEWS[game.id];

  const handleClick = () => {
    if (game.live) {
      navigate(`/${game.id}`);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="relative overflow-hidden transition-all duration-150 flex flex-col"
      style={{
        background: hovered && game.live ? colors.accentBg : colors.bgSecondary,
        cursor: game.live ? "pointer" : "default",
      }}
    >
      {/* Visual preview */}
      <div
        className="w-full aspect-video overflow-hidden border-b"
        style={{ background: colors.bgTertiary, borderColor: colors.border }}
      >
        {Preview ? <Preview colors={colors} accent={colors.accent} /> : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs font-mono tracking-widest" style={{ color: colors.textDisabled }}>PREVIEW SOON</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 md:p-5 flex flex-col gap-1.5">

        {/* Name */}
        <h2
          className="font-black tracking-wide font-sans uppercase text-xs md:text-sm"
          style={{ color: game.live ? colors.textSecondary : colors.textDarkGray }}
        >
          {game.name}
        </h2>

        {/* Description — hidden on mobile */}
        <p
          className="hidden md:block font-mono leading-relaxed tracking-wide"
          style={{ color: colors.textMuted, fontSize: "10px" }}
        >
          {game.description}
        </p>

        {/* Single button — PLAY NOW if live, COMING SOON if not */}
        <div
          className="inline-flex items-center gap-1 mt-1 px-2 py-1 font-mono transition-all duration-150 self-start"
          style={{
            border: `1px solid ${game.live ? colors.accentBorder : colors.borderSecondary}`,
            color: game.live
              ? hovered ? (colors.theme === "dark" ? colors.bgSecondary : colors.bg) : colors.accent
              : colors.textMuted,
            background: game.live && hovered ? colors.accent : "transparent",
            fontSize: "8px",
            letterSpacing: "0.15em",
            cursor: game.live ? "pointer" : "default",
          }}
        >
          {game.live ? (
            <>
              <span className="hidden md:inline">PLAY NOW</span>
              <span className="md:hidden">PLAY</span>
              <span>→</span>
            </>
          ) : (
            <span>COMING SOON</span>
          )}
        </div>

      </div>
    </div>
  );
}