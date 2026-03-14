import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { TEAMS, HARD_METRICS } from "../config/criteria";
import PlayerSearch from "./PlayerSearch";
import { getPlayers } from "../services/PlayerService";
import { getApiBaseUrl, getAdminHeaders } from "../config";
export default function FeedbackForm({ onClose, hardCriteria = [] }) {
  const { colors } = useTheme();
  const [mode, setMode] = useState("report"); // report, add, invalid_pair
  const [playerName, setPlayerName] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamCode, setTeamCode] = useState("");
  const [pairType, setPairType] = useState("team_metric");
  const [criterionA, setCriterionA] = useState("");
  const [criterionB, setCriterionB] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const hardTeams = TEAMS;
  const hardMetrics = HARD_METRICS;

  const criterionOptionsA =
    pairType === "team_metric"
      ? hardTeams.map((c) => ({ type: c.type, code: c.code, label: c.name || c.code }))
      : hardMetrics.map((c) => ({ type: c.type, code: c.code, label: c.label || c.code }));

  const criterionOptionsB = hardMetrics.map((c) => ({ type: c.type, code: c.code, label: c.label || c.code }));

  const parseCriterionValue = (value, options) => {
    const direct = options.find((o) => `${o.type}|${o.code}|${o.label}` === value);
    if (direct) return direct;

    const byLabel = options.find((o) => o.label.toLowerCase() === value.toLowerCase());
    if (byLabel) return byLabel;

    const byCode = options.find((o) => o.code.toLowerCase() === value.toLowerCase());
    if (byCode) return byCode;

    return null;
  };

  // Load players when switching to "add" mode
  useEffect(() => {
    if (mode === "add" && players.length === 0) {
      setLoadingPlayers(true);
      getPlayers()
        .then(setPlayers)
        .catch((e) => setError(e.message))
        .finally(() => setLoadingPlayers(false));
    }
  }, [mode, players.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === "report") {
      // Report missing player mode
      if (!playerName.trim() || !teamCode) {
        setError("Please provide both player name and team");
        return;
      }
    } else if (mode === "add") {
      // Add player link mode
      if (!selectedPlayer || !teamCode) {
        setError("Please select both player and team");
        return;
      }

      // Check if this player-team link already exists
      if (selectedPlayer.teams.includes(teamCode)) {
        setError(`${selectedPlayer.name} is already linked with this team`);
        return;
      }
    } else {
      if (!criterionA || !criterionB) {
        setError("Please select both criteria for the invalid pair");
        return;
      }

      if (criterionA === criterionB) {
        setError("Please choose two different criteria");
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      let payload;
      if (mode === "report") {
        payload = { type: "report", playerName: playerName.trim(), teamCode, note: note.trim() };
      } else if (mode === "add") {
        payload = { type: "add", playerId: selectedPlayer.id, playerName: selectedPlayer.name, teamCode, note: note.trim() };
      } else {
        const a = parseCriterionValue(criterionA, criterionOptionsA);
        const b = parseCriterionValue(criterionB, criterionOptionsB);
        if (!a || !b) {
          throw new Error("Please select valid criteria from the suggestions");
        }
        payload = {
          type: "invalid_pair",
          pairType,
          criterionAType: a.type,
          criterionACode: a.code,
          criterionALabel: a.label,
          criterionBType: b.type,
          criterionBCode: b.code,
          criterionBLabel: b.label,
          note: note.trim(),
        };
      }

      const response = await fetch(`${getApiBaseUrl()}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };



  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className="w-full max-w-md p-6 text-center"
          style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
        >
          <p className="text-sm font-mono" style={{ color: colors.accent }}>
            ✓ FEEDBACK SUBMITTED
          </p>
          <p className="mt-2 text-xs font-mono" style={{ color: colors.textMuted }}>
            Thank you for your feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md p-6"
        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-sm font-black tracking-widest font-sans uppercase"
            style={{ color: colors.textSecondary }}
          >
            PLAYER FEEDBACK
          </h2>
          <button
            onClick={onClose}
            className="text-xs font-mono"
            style={{ color: colors.textMuted }}
          >
            ✕
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setMode("report");
              setSelectedPlayer(null);
              setError(null);
            }}
            className="flex-1 px-4 py-2 text-xs font-mono tracking-widest transition-all duration-150"
            style={{
              border: `1px solid ${mode === "report" ? colors.accentBorder : colors.border}`,
              color: mode === "report" ? colors.accent : colors.textMuted,
              background: mode === "report" ? colors.accentBg : "transparent",
            }}
          >
            REPORT MISSING
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("add");
              setPlayerName("");
              setError(null);
            }}
            className="flex-1 px-4 py-2 text-xs font-mono tracking-widest transition-all duration-150"
            style={{
              border: `1px solid ${mode === "add" ? colors.accentBorder : colors.border}`,
              color: mode === "add" ? colors.accent : colors.textMuted,
              background: mode === "add" ? colors.accentBg : "transparent",
            }}
          >
            ADD PLAYER LINK
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2 mb-1">
            <button
              type="button"
              onClick={() => {
                setMode("invalid_pair");
                setError(null);
              }}
              className="flex-1 px-3 py-2 text-[10px] font-mono tracking-widest transition-all duration-150"
              style={{
                border: `1px solid ${mode === "invalid_pair" ? colors.accentBorder : colors.border}`,
                color: mode === "invalid_pair" ? colors.accent : colors.textMuted,
                background: mode === "invalid_pair" ? colors.accentBg : "transparent",
              }}
            >
              HARD INVALID PAIR
            </button>
          </div>

          {mode === "report" ? (
            <div>
              <label
                className="block text-xs font-mono mb-1"
                style={{ color: colors.textMuted }}
              >
                PLAYER NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name..."
                className="w-full px-3 py-2 text-xs font-mono"
                style={{
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                }}
              />
              <p className="mt-1 text-[10px] font-mono" style={{ color: colors.textMuted, opacity: 0.7 }}>
                Report a player who is not in our database
              </p>
            </div>
          ) : mode === "add" ? (
            <div>
              <label
                className="block text-xs font-mono mb-1"
                style={{ color: colors.textMuted }}
              >
                SELECT PLAYER
              </label>
              {loadingPlayers ? (
                <p className="text-xs font-mono py-2" style={{ color: colors.textMuted }}>
                  Loading players...
                </p>
              ) : (
                <>
                  <PlayerSearch
                    players={players}
                    onSelect={setSelectedPlayer}
                    placeholder="Search existing player..."
                  />
                  {selectedPlayer && (
                    <div className="mt-2 px-2 py-1 text-xs font-mono" style={{ background: colors.accentBg, border: `1px solid ${colors.accentBorder}` }}>
                      Selected: {selectedPlayer.name}
                      <button
                        type="button"
                        onClick={() => setSelectedPlayer(null)}
                        className="ml-2 text-[10px]"
                        style={{ color: colors.accent }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </>
              )}
              <p className="mt-1 text-[10px] font-mono" style={{ color: colors.textMuted, opacity: 0.7 }}>
                Link an existing player to a new team
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-mono mb-1" style={{ color: colors.textMuted }}>
                  PAIR TYPE
                </label>
                <select
                  value={pairType}
                  onChange={(e) => {
                    setPairType(e.target.value);
                    setCriterionA("");
                    setCriterionB("");
                  }}
                  className="w-full px-3 py-2 text-xs font-mono"
                  style={{
                    background: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                  }}
                >
                  <option value="team_metric">TEAM × METRIC</option>
                  <option value="metric_metric">METRIC × METRIC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono mb-1" style={{ color: colors.textMuted }}>
                  CRITERION A
                </label>
                <input
                  value={criterionA}
                  onChange={(e) => setCriterionA(e.target.value)}
                  list="criteria-a-options"
                  placeholder="Type to search criteria A..."
                  className="w-full px-3 py-2 text-xs font-mono"
                  style={{
                    background: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                  }}
                />
                <datalist id="criteria-a-options">
                  {criterionOptionsA.map((c) => (
                    <option
                      key={`${c.type}:${c.code}`}
                      value={`${c.type}|${c.code}|${c.label}`}
                    >
                      {c.label} ({c.code})
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-mono mb-1" style={{ color: colors.textMuted }}>
                  CRITERION B
                </label>
                <input
                  value={criterionB}
                  onChange={(e) => setCriterionB(e.target.value)}
                  list="criteria-b-options"
                  placeholder="Type to search criteria B..."
                  className="w-full px-3 py-2 text-xs font-mono"
                  style={{
                    background: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                  }}
                />
                <datalist id="criteria-b-options">
                  {criterionOptionsB.map((c) => (
                    <option
                      key={`${c.type}:${c.code}`}
                      value={`${c.type}|${c.code}|${c.label}`}
                    >
                      {c.label} ({c.code})
                    </option>
                  ))}
                </datalist>
                <p className="mt-1 text-[10px] font-mono" style={{ color: colors.textMuted, opacity: 0.7 }}>
                  Report combinations that should be blocked in hard mode.
                </p>
              </div>
            </>
          )}

          {mode !== "invalid_pair" && (
            <div>
              <label
                className="block text-xs font-mono mb-1"
                style={{ color: colors.textMuted }}
              >
                TEAM
              </label>
              <select
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono"
                style={{
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                }}
              >
                <option value="">Select a team...</option>
                {TEAMS.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name} ({team.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              className="block text-xs font-mono mb-1"
              style={{ color: colors.textMuted }}
            >
              NOTE (OPTIONAL)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional information..."
              rows={3}
              className="w-full px-3 py-2 text-xs font-mono"
              style={{
                background: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
                resize: "none",
              }}
            />
          </div>

          {error && (
            <p className="text-xs font-mono" style={{ color: "#ff3c3c" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-xs font-mono tracking-widest transition-all duration-150"
            style={{
              border: `1px solid ${colors.accentBorder}`,
              color: colors.accent,
              background: colors.accentBg,
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {submitting ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
          </button>
        </form>
      </div>
    </div>
  );
}
