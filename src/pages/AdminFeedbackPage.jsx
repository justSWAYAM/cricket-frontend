import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import AddPlayerModal from "../components/AddPlayerModal";
import AddTeamLinkModal from "../components/AddTeamLinkModal";
import { getApiBaseUrl } from "../config";

export default function AdminFeedbackPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddTeamLink, setShowAddTeamLink] = useState(false);
  const [prefilledData, setPrefilledData] = useState(null);
  const [rules, setRules] = useState([]);

  const loadFeedback = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to load feedback");

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/hard-grid/rules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load hard-grid rules");
      const data = await response.json();
      setRules(data);
    } catch (err) {
      console.error("Failed to load hard-grid rules:", err);
    }
  };

  useEffect(() => {
    loadFeedback();
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Reload feedback
      loadFeedback();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const blockPairFromFeedback = async (item) => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/hard-grid/block-pair`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pairType: item.pairType,
          criterionAType: item.criterionAType,
          criterionACode: item.criterionACode,
          criterionALabel: item.criterionALabel,
          criterionBType: item.criterionBType,
          criterionBCode: item.criterionBCode,
          criterionBLabel: item.criterionBLabel,
          note: item.note,
          sourceFeedbackId: item.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to block pair");
      }

      loadFeedback();
      loadRules();
    } catch (err) {
      console.error("Failed to block pair:", err);
    }
  };

  const disableCriterionFromFeedback = async (item, side) => {
    const token = localStorage.getItem("admin_token");
    const isA = side === "A";
    const criterionType = isA ? item.criterionAType : item.criterionBType;
    const criterionCode = isA ? item.criterionACode : item.criterionBCode;
    const criterionLabel = isA ? item.criterionALabel : item.criterionBLabel;

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/hard-grid/block-criterion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          criterionType,
          criterionCode,
          criterionLabel,
          note: item.note,
          sourceFeedbackId: item.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to disable criterion");
      }

      loadFeedback();
      loadRules();
    } catch (err) {
      console.error("Failed to disable criterion:", err);
    }
  };

  const toggleRule = async (id, active) => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/hard-grid/rules/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) throw new Error("Failed to update rule");
      loadRules();
    } catch (err) {
      console.error("Failed to toggle rule:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const handleQuickAddFromFeedback = (item) => {
    if (item.type === "report") {
      // Open add player modal (can't prefill name as it's a new player)
      setShowAddPlayer(true);
    } else if (item.type === "add" && item.playerId) {
      // Open add team link modal with prefilled data
      setPrefilledData({
        playerId: item.playerId,
        playerName: item.playerName,
        teamCode: item.teamCode,
      });
      setShowAddTeamLink(true);
    }
  };

  const handleModalSuccess = () => {
    // Reload feedback and clear player cache
    loadFeedback();
    localStorage.removeItem("cricketxi_players");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "rgba(255,165,0,0.8)";
      case "reviewed":
        return "rgba(100,150,255,0.8)";
      case "added":
        return "rgba(50,205,50,0.8)";
      case "rejected":
        return "rgba(255,60,60,0.8)";
      default:
        return colors.textMuted;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: colors.bg, color: colors.textSecondary }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: colors.border }}
      >
        <h1
          className="text-sm font-black tracking-widest font-sans uppercase"
          style={{ color: colors.textSecondary }}
        >
          ADMIN: FEEDBACK
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddPlayer(true)}
            className="px-4 py-2 text-xs font-mono tracking-widest transition-all"
            style={{
              border: `1px solid ${colors.accentBorder}`,
              color: colors.accent,
              background: colors.accentBg,
            }}
          >
            + ADD PLAYER
          </button>
          <button
            onClick={() => {
              setPrefilledData(null);
              setShowAddTeamLink(true);
            }}
            className="px-4 py-2 text-xs font-mono tracking-widest transition-all"
            style={{
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
              background: "transparent",
            }}
          >
            + ADD TEAM LINK
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-mono tracking-widest"
            style={{ color: colors.textMuted }}
          >
            LOGOUT →
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {loading && (
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>
            LOADING...
          </p>
        )}

        {error && (
          <p className="text-xs font-mono" style={{ color: "#ff3c3c" }}>
            ERROR: {error}
          </p>
        )}

        {!loading && !error && feedback.length === 0 && (
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>
            NO FEEDBACK SUBMISSIONS YET
          </p>
        )}

        {!loading && !error && feedback.length > 0 && (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="p-4"
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.bgSecondary,
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className="text-sm font-mono font-bold"
                        style={{ color: colors.textSecondary }}
                      >
                        {item.type === "invalid_pair"
                          ? `${item.criterionALabel || item.criterionACode} × ${item.criterionBLabel || item.criterionBCode}`
                          : item.playerName}
                      </p>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5"
                        style={{
                          background:
                            item.type === "add"
                              ? colors.accentBg
                              : item.type === "invalid_pair"
                                ? "rgba(255,80,80,0.1)"
                                : "rgba(255,165,0,0.1)",
                          color:
                            item.type === "add"
                              ? colors.accent
                              : item.type === "invalid_pair"
                                ? "rgba(255,80,80,0.9)"
                                : "rgba(255,165,0,0.8)",
                          border: `1px solid ${
                            item.type === "add"
                              ? colors.accentBorder
                              : item.type === "invalid_pair"
                                ? "rgba(255,80,80,0.4)"
                                : "rgba(255,165,0,0.3)"
                          }`,
                        }}
                      >
                        {item.type === "add" ? "ADD LINK" : item.type === "invalid_pair" ? "INVALID PAIR" : "REPORT"}
                      </span>
                    </div>
                    {item.type === "invalid_pair" ? (
                      <>
                        <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
                          Pair type: {item.pairType}
                        </p>
                        <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
                          A: {item.criterionAType}/{item.criterionACode}
                        </p>
                        <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
                          B: {item.criterionBType}/{item.criterionBCode}
                        </p>
                      </>
                    ) : (
                      <p
                        className="text-xs font-mono mt-1"
                        style={{ color: colors.textMuted }}
                      >
                        TEAM: {item.teamCode}
                      </p>
                    )}
                    {item.playerId && (
                      <p
                        className="text-[10px] font-mono mt-1"
                        style={{ color: colors.textDisabled }}
                      >
                        Player ID: {item.playerId}
                      </p>
                    )}
                    {item.note && (
                      <p
                        className="text-xs font-mono mt-2 italic"
                        style={{ color: colors.textMuted }}
                      >
                        "{item.note}"
                      </p>
                    )}
                    <p
                      className="text-[10px] font-mono mt-2"
                      style={{ color: colors.textDisabled }}
                    >
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="text-xs font-mono font-bold px-2 py-1"
                    style={{
                      color: getStatusColor(item.status),
                      border: `1px solid ${getStatusColor(item.status)}`,
                    }}
                  >
                    {item.status.toUpperCase()}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {["pending", "reviewed", "added", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item.id, status)}
                      disabled={item.status === status}
                      className="px-3 py-1 text-[10px] font-mono tracking-wide transition-all"
                      style={{
                        border: `1px solid ${colors.border}`,
                        color: item.status === status ? colors.textDisabled : colors.textMuted,
                        background: item.status === status ? colors.bgSecondary : "transparent",
                        opacity: item.status === status ? 0.5 : 1,
                        cursor: item.status === status ? "not-allowed" : "pointer",
                      }}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                  
                  {/* Quick Action Button */}
                  <div className="flex-1" />
                  {item.status !== "added" && item.type !== "invalid_pair" && (
                    <button
                      onClick={() => handleQuickAddFromFeedback(item)}
                      className="px-3 py-1 text-[10px] font-mono tracking-wide transition-all"
                      style={{
                        border: `1px solid ${colors.accentBorder}`,
                        color: colors.accent,
                        background: colors.accentBg,
                      }}
                    >
                      {item.type === "add" ? "→ ADD LINK NOW" : "→ ADD PLAYER"}
                    </button>
                  )}

                  {item.type === "invalid_pair" && (
                    <>
                      <button
                        onClick={() => blockPairFromFeedback(item)}
                        className="px-3 py-1 text-[10px] font-mono tracking-wide transition-all"
                        style={{
                          border: `1px solid rgba(255,80,80,0.5)`,
                          color: "rgba(255,80,80,0.95)",
                          background: "rgba(255,80,80,0.08)",
                        }}
                      >
                        BLOCK PAIR
                      </button>
                      <button
                        onClick={() => disableCriterionFromFeedback(item, "A")}
                        className="px-3 py-1 text-[10px] font-mono tracking-wide transition-all"
                        style={{
                          border: `1px solid ${colors.border}`,
                          color: colors.textMuted,
                          background: "transparent",
                        }}
                      >
                        DISABLE A
                      </button>
                      <button
                        onClick={() => disableCriterionFromFeedback(item, "B")}
                        className="px-3 py-1 text-[10px] font-mono tracking-wide transition-all"
                        style={{
                          border: `1px solid ${colors.border}`,
                          color: colors.textMuted,
                          background: "transparent",
                        }}
                      >
                        DISABLE B
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10">
            <h2 className="text-xs font-mono tracking-widest mb-3" style={{ color: colors.textMuted }}>
              HARD GRID RULES
            </h2>
            {rules.length === 0 ? (
              <p className="text-xs font-mono" style={{ color: colors.textDisabled }}>
                No hard-grid rules yet.
              </p>
            ) : (
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="px-3 py-2 flex items-center justify-between"
                    style={{ border: `1px solid ${colors.border}`, background: colors.bgSecondary }}
                  >
                    <div className="text-xs font-mono" style={{ color: colors.textMuted }}>
                      {rule.ruleType === "pair"
                        ? `${rule.criterionALabel || rule.criterionACode} × ${rule.criterionBLabel || rule.criterionBCode}`
                        : `${rule.criterionType}: ${rule.criterionLabel || rule.criterionCode}`}
                      <span style={{ marginLeft: 8, color: rule.active ? colors.accent : colors.textDisabled }}>
                        {rule.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id, !rule.active)}
                      className="px-3 py-1 text-[10px] font-mono tracking-wide"
                      style={{
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary,
                        background: "transparent",
                      }}
                    >
                      {rule.active ? "DEACTIVATE" : "ACTIVATE"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddPlayer && (
        <AddPlayerModal
          onClose={() => setShowAddPlayer(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {showAddTeamLink && (
        <AddTeamLinkModal
          onClose={() => {
            setShowAddTeamLink(false);
            setPrefilledData(null);
          }}
          onSuccess={handleModalSuccess}
          prefilledPlayerId={prefilledData?.playerId}
          prefilledTeamCode={prefilledData?.teamCode}
        />
      )}
    </div>
  );
}
