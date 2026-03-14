import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getApiBaseUrl } from "../config";


export default function AdminLoginPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.token);
      navigate("/admin/feedback");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: colors.bg, color: colors.textSecondary }}
    >
      <div
        className="w-full max-w-md p-8"
        style={{ border: `1px solid ${colors.border}` }}
      >
        <h1
          className="text-lg font-black tracking-widest font-sans uppercase mb-6 text-center"
          style={{ color: colors.textSecondary }}
        >
          ADMIN LOGIN
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-mono mb-2"
              style={{ color: colors.textMuted }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="w-full px-4 py-2 text-sm font-mono"
              style={{
                background: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
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
            disabled={loading}
            className="px-6 py-3 text-xs font-mono tracking-widest transition-all duration-150"
            style={{
              border: `1px solid ${colors.accentBorder}`,
              color: colors.accent,
              background: colors.accentBg,
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <a
            href="/"
            className="text-xs font-mono text-center mt-2"
            style={{ color: colors.textMuted }}
          >
            ← BACK TO HOME
          </a>
        </form>
      </div>
    </div>
  );
}
