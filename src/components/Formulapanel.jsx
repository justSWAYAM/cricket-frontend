import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const FORMULAS = [
  {
    category: "BATTING",
    color: "#00ff87",
    items: [
      {
        name: "Batting Strike Rate",
        formula: "Runs Scored × 100 / Balls Faced",
        explain: "How many runs scored per 100 balls. Higher = more aggressive batter.",
        thresholds: "> 150 (hard), > 160 (very hard)",
      },
      {
        name: "Batting Average",
        formula: "Total Runs / Times Dismissed",
        explain: "Average runs scored each time they bat before getting out. Higher = more consistent.",
        thresholds: "> 35 (hard), > 40 (very hard)",
      },
      {
        name: "Total Runs",
        formula: "Sum of all runs scored across all IPL innings",
        explain: "Career IPL runs for this team. Counts across all seasons played.",
        thresholds: "1000+ (hard), 2000+ (very hard)",
      },
      {
        name: "Sixes / Fours",
        formula: "Count of balls hit for 6 / 4 runs",
        explain: "Total boundary hits across all IPL innings for this team.",
        thresholds: "40+ sixes, 50+ sixes, 100+ fours",
      },
      {
        name: "Centuries",
        formula: "Innings where batter scored 100+ runs",
        explain: "How many times they reached 100 runs in a single innings. Rare in T20.",
        thresholds: "2+ centuries (very hard)",
      },
    ],
  },
  {
    category: "BOWLING",
    color: "#ff8c00",
    items: [
      {
        name: "Bowling Strike Rate",
        formula: "Balls Bowled / Wickets Taken",
        explain: "How many balls on average to take one wicket. Lower = more lethal.",
        thresholds: "< 15 (hard)",
      },
      {
        name: "Economy Rate",
        formula: "Runs Conceded / Overs Bowled",
        explain: "Average runs given away per over. Lower = harder to score against.",
        thresholds: "< 7 (hard)",
      },
      {
        name: "Bowling Average",
        formula: "Runs Conceded / Wickets Taken",
        explain: "Average runs given per wicket taken. Lower = more efficient bowler.",
        thresholds: "< 22 (hard), < 20 (very hard)",
      },
      {
        name: "Total Wickets",
        formula: "Count of dismissals credited to the bowler",
        explain: "Career IPL wickets for this team across all seasons.",
        thresholds: "50+ wickets (hard)",
      },
      {
        name: "4-Wicket Haul",
        formula: "Innings where bowler took 4+ wickets",
        explain: "How many times they took 4 or more wickets in a single innings. Very rare.",
        thresholds: "2+ hauls (very hard)",
      },
    ],
  },
];

export default function FormulaPanel() {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });
  const [expanded, setExpanded] = useState(null); // which formula is expanded

  return (
    <div
      className="w-full font-mono"
      style={{
        border: `1px solid ${colors.border}`,
        background: colors.bgSecondary,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-3 py-2 border-b flex items-center justify-between text-left"
        style={{ borderColor: colors.border }}
      >
        <span className="text-xs tracking-widest font-bold" style={{ color: colors.textSecondary }}>
          STAT GLOSSARY
        </span>
        <span className="text-[10px] tracking-widest" style={{ color: colors.textMuted }}>
          {isOpen ? "TAP TO MINIMIZE" : "TAP TO OPEN"}
        </span>
      </button>

      {isOpen && (
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {FORMULAS.map((group) => (
            <div key={group.category}>
              {/* Category label */}
              <div
                className="px-3 py-1.5 text-[10px] tracking-widest font-bold border-b"
                style={{
                  borderColor: colors.border,
                  color: group.color,
                  background: `${group.color}10`,
                }}
              >
                {group.category}
              </div>

              {group.items.map((item, i) => (
                <div
                  key={item.name}
                  className="border-b"
                  style={{ borderColor: colors.border }}
                >
                  {/* Row — click to expand */}
                  <button
                    onClick={() =>
                      setExpanded(expanded === `${group.category}-${i}` ? null : `${group.category}-${i}`)
                    }
                    className="w-full text-left px-3 py-2 transition-all"
                    style={{
                      background:
                        expanded === `${group.category}-${i}`
                          ? `${group.color}08`
                          : "transparent",
                    }}
                  >
                    <div
                      className="text-[12px] font-bold tracking-wide"
                      style={{ color: group.color }}
                    >
                      {item.name}
                    </div>
                    <div
                      className="text-[11px] mt-1 font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.formula}
                    </div>
                  </button>

                  {/* Expanded explanation */}
                  {expanded === `${group.category}-${i}` && (
                    <div className="px-3 pb-2 flex flex-col gap-1">
                      <div
                        className="text-[11px] leading-relaxed"
                        style={{ color: colors.textSecondary, opacity: 0.9 }}
                      >
                        {item.explain}
                      </div>
                      {item.thresholds && (
                        <div
                          className="text-[10px] font-mono tracking-wide"
                          style={{ color: group.color, opacity: 0.9 }}
                        >
                          USED AS: {item.thresholds}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}