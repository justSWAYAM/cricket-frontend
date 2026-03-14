import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { TEAMS } from "../config/criteria";
import PlayerSearch from "./PlayerSearch";
import { getPlayers } from "../services/PlayerService";
import { getApiBaseUrl, getAdminHeaders } from "../config";
export default function AddTeamLinkModal({ onClose, onSuccess, prefilledPlayerId = null, prefilledTeamCode = null }) {
  const { colors } = useTheme();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamCode, setTeamCode] = useState(prefilledTeamCode || "");
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlayers()
      .then((data) => {
        setPlayers(data);
        // If prefilled, find and set the player
        if (prefilledPlayerId) {
          const player = data.find((p) => p.id === prefilledPlayerId);
          if (player) {
            setSelectedPlayer(player);
          }
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingPlayers(false));
  }, [prefilledPlayerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlayer || !teamCode) {
      setError("Please select both player and team");
      return;
    }

    // Check if link already exists
    if (selectedPlayer.teams.includes(teamCode)) {
      setError(`${selectedPlayer.name} is already linked with ${teamCode}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${getApiBaseUrl()}/api/player-management/add-team-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          teamCode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add team link");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  

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
            ADD TEAM LINK
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
                  placeholder="Search player..."
                  disabled={!!prefilledPlayerId}
                />
                {selectedPlayer && (
                  <div
                    className="mt-2 px-3 py-2 text-xs font-mono"
                    style={{
                      background: colors.accentBg,
                      border: `1px solid ${colors.accentBorder}`,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p style={{ color: colors.accent }}>{selectedPlayer.name}</p>
                        <p className="text-[10px] mt-1" style={{ color: colors.textMuted }}>
                          Current teams: {selectedPlayer.teams.join(", ") || "None"}
                        </p>
                      </div>
                      {!prefilledPlayerId && (
                        <button
                          type="button"
                          onClick={() => setSelectedPlayer(null)}
                          className="text-[10px]"
                          style={{ color: colors.accent }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: colors.textMuted }}>
              SELECT TEAM
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

          {error && (
            <p className="text-xs font-mono" style={{ color: "#ff3c3c" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={submitting || loadingPlayers}
              className="flex-1 px-6 py-2 text-xs font-mono tracking-widest transition-all duration-150"
              style={{
                border: `1px solid ${colors.accentBorder}`,
                color: colors.accent,
                background: colors.accentBg,
                opacity: submitting || loadingPlayers ? 0.5 : 1,
              }}
            >
              {submitting ? "ADDING..." : "ADD LINK"}
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
