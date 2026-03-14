import { useTheme } from "../../context/ThemeContext";

const TEAM_COLORS = {
  MI:   { bg: "#1a3a6b", border: "#2255aa", text: "#4488ff" },
  CSK:  { bg: "#3a2e00", border: "#aa8800", text: "#ffcc00" },
  RCB:  { bg: "#3a1a1a", border: "#aa2222", text: "#ff4444" },
  KKR:  { bg: "#1a0a3a", border: "#6622aa", text: "#9944ff" },
  DC:   { bg: "#0a1a3a", border: "#1144aa", text: "#4488ff" },
  DD:   { bg: "#0a1a3a", border: "#1144aa", text: "#4488ff" },
  SRH:  { bg: "#3a1a00", border: "#aa4400", text: "#ff6600" },
  PBKS: { bg: "#3a0a0a", border: "#aa1111", text: "#ff3333" },
  KXIP: { bg: "#3a0a0a", border: "#aa1111", text: "#ff3333" },
  RR:   { bg: "#1a0a2a", border: "#7733aa", text: "#cc66ff" },
  GT:   { bg: "#001a2a", border: "#004466", text: "#0099cc" },
  LSG:  { bg: "#001a1a", border: "#006644", text: "#00cc88" },
  DQ:   { bg: "#1a1a00", border: "#666600", text: "#cccc00" },
  PWI:  { bg: "#1a0a00", border: "#663300", text: "#cc6600" },
  GL:   { bg: "#002200", border: "#005500", text: "#00aa00" },
  RPSG: { bg: "#00001a", border: "#000066", text: "#0000cc" },
  KTK:  { bg: "#001a0a", border: "#004422", text: "#00aa55" },
};

const NATIONALITY_COLORS = {
  IND: { bg: "#1a0a00", border: "#ff9933", text: "#ff9933" },
  AUS: { bg: "#00001a", border: "#0000cc", text: "#4444ff" },
  SA:  { bg: "#001a00", border: "#007A4D", text: "#00cc66" },
  ENG: { bg: "#1a0000", border: "#cc0000", text: "#ff4444" },
  NZ:  { bg: "#00001a", border: "#003399", text: "#4488ff" },
  WI:  { bg: "#1a0000", border: "#990000", text: "#ffcc00" },
  PAK: { bg: "#001a00", border: "#006600", text: "#00cc00" },
  SL:  { bg: "#1a0a00", border: "#8B0000", text: "#ffcc00" },
  BAN: { bg: "#001a00", border: "#006a4e", text: "#00cc88" },
  AFG: { bg: "#00001a", border: "#000066", text: "#4444ff" },
};

// Runs metrics = green tint, Wickets metrics = orange tint
const METRIC_STYLE = {
  "Most Runs":    { bg: "#001a0a", border: "#00aa55", text: "#00ff87", tag: "RUNS" },
  "Most Wickets": { bg: "#1a0a00", border: "#aa5500", text: "#ff8c00", tag: "WICKETS" },
};

export default function CriteriaBadge({ criterion, size = "md" }) {
  const { colors } = useTheme();
  const isSmall = size === "sm";

  // ── METRIC ────────────────────────────────────────────────────
  if (criterion.type === "metric") {
    const style = METRIC_STYLE[criterion.statType] || {
      bg: colors.bgSecondary, border: colors.border, text: colors.accent, tag: "METRIC",
    };
    return (
      <div
        className="flex flex-col items-center justify-center gap-1 w-full h-full"
        style={{
          background: style.bg,
          border: `1px solid ${style.border}`,
          padding: isSmall ? "6px" : "10px",
        }}
      >
        {/* Big readable label: SR > 150, 1000+ Runs, etc */}
        <span
          className="font-black font-mono tracking-wide leading-none text-center"
          style={{
            color: style.text,
            fontSize: isSmall ? "12px" : "16px",
          }}
        >
          {criterion.label}
        </span>
        {/* Category tag */}
        <span
          className="font-mono tracking-widest text-center leading-none"
          style={{
            color: style.text,
            opacity: 0.5,
            fontSize: isSmall ? "8px" : "10px",
          }}
        >
          {style.tag}
        </span>
      </div>
    );
  }

  // ── TEAM ──────────────────────────────────────────────────────
  if (criterion.type === "team") {
    const style = TEAM_COLORS[criterion.code] || {
      bg: colors.bgSecondary, border: colors.border, text: colors.textSecondary,
    };
    return (
      <div
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        style={{
          background: style.bg,
          border: `1px solid ${style.border}`,
        }}
      >
        {/* Logo as background */}
        {criterion.logo && (
          <img
            src={criterion.logo}
            alt={criterion.code}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: 0.32,
              padding: "8px",
              filter: "brightness(1.35) saturate(1.2) contrast(1.05)",
            }}
          />
        )}
        {/* Team code overlay */}
        <div className="relative flex flex-col items-center gap-1" style={{ padding: isSmall ? "6px" : "10px" }}>
          <span
            className="font-black font-mono tracking-wider leading-none"
            style={{
              color: style.text,
              fontSize: isSmall ? "13px" : "18px",
              textShadow: `0 0 12px ${style.border}`,
            }}
          >
            {criterion.code}
          </span>
          <span
            className="font-mono tracking-wide leading-none"
            style={{ color: style.text, opacity: 0.7, fontSize: isSmall ? "8px" : "10px" }}
          >
            TEAM
          </span>
        </div>
      </div>
    );
  }

  // ── NATIONALITY ───────────────────────────────────────────────
  const style = NATIONALITY_COLORS[criterion.code] || {
    bg: colors.bgSecondary, border: colors.border, text: colors.textSecondary,
  };
  return (
    <div
      className="relative flex items-center justify-center w-full h-full overflow-hidden"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      {criterion.logo && (
        <img
          src={criterion.logo}
          alt={criterion.code}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: 0.12, padding: "6px" }}
        />
      )}
      <div className="relative flex flex-col items-center gap-1" style={{ padding: isSmall ? "6px" : "10px" }}>
        <span
          className="font-black font-mono tracking-wider leading-none"
          style={{ color: style.text, fontSize: isSmall ? "11px" : "15px" }}
        >
          {criterion.code}
        </span>
        <span
          className="font-mono tracking-wide leading-none"
          style={{ color: style.text, opacity: 0.6, fontSize: isSmall ? "7px" : "9px" }}
        >
          NATION
        </span>
      </div>
    </div>
  );
}