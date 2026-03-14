import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { TEAMS, NATIONALITIES } from "../config/criteria";
import { getApiBaseUrl, getAdminHeaders } from "../config";

export default function AddPlayerModal({ onClose, onSuccess }) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !nationality) {
      setError("Name and nationality are required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${getApiBaseUrl()}/api/player-management/add-player`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          nationality,
          teamCodes: selectedTeams,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add player");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  

  const toggleTeam = (teamCode) => {
    setSelectedTeams((prev) =>
      prev.includes(teamCode) ? prev.filter((t) => t !== teamCode) : [...prev, teamCode]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-sm font-black tracking-widest font-sans uppercase"
            style={{ color: colors.textSecondary }}
          >
            ADD NEW PLAYER
          </h2>
          <button
            onClick={onClose}
            className="text-xs font-mono"
            style={{ color: colors.textMuted }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: colors.textMuted }}>
              PLAYER NAME *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full player name..."
              className="w-full px-3 py-2 text-xs font-mono"
              style={{
                background: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: colors.textMuted }}>
              NATIONALITY *
            </label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono"
              style={{
                background: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
              }}
            >
              <option value="">Select nationality...</option>
              {NATIONALITIES.map((nat) => (
                <option key={nat.code} value={nat.code}>
                  {nat.name} ({nat.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono mb-2" style={{ color: colors.textMuted }}>
              IPL TEAMS (SELECT ALL THAT APPLY)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TEAMS.map((team) => (
                <button
                  key={team.code}
                  type="button"
                  onClick={() => toggleTeam(team.code)}
                  className="px-3 py-2 text-xs font-mono text-left transition-all"
                  style={{
                    border: `1px solid ${selectedTeams.includes(team.code) ? colors.accentBorder : colors.border}`,
                    background: selectedTeams.includes(team.code) ? colors.accentBg : "transparent",
                    color: selectedTeams.includes(team.code) ? colors.accent : colors.textMuted,
                  }}
                >
                  {team.code}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-mono" style={{ color: "#ff3c3c" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-2 text-xs font-mono tracking-widest transition-all duration-150"
              style={{
                border: `1px solid ${colors.accentBorder}`,
                color: colors.accent,
                background: colors.accentBg,
                opacity: submitting ? 0.5 : 1,
              }}
            >
              {submitting ? "ADDING..." : "ADD PLAYER"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-mono tracking-widest transition-all duration-150"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
                background: "transparent",
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
