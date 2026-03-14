import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("cricketxi-theme");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("cricketxi-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = {
    dark: {
      bg: "#000000",
      bgSecondary: "#0a0a0a",
      bgTertiary: "#0d0d0d",
      border: "#1f1f1f",
      borderSecondary: "#333333",
      borderLight: "rgba(255,255,255,0.025)",
      text: "#ffffff",
      textSecondary: "#f0f0f0",
      textMuted: "#555555",
      textDisabled: "#333333",
      textGray: "#666666",
      textDarkGray: "#444444",
      accent: "#00ff87",
      accentBg: "rgba(0,255,135,0.04)",
      accentBgHover: "rgba(0,255,135,0.08)",
      accentBorder: "#00ff87",
      scanline: "rgba(0,0,0,0.03)",
      watermark: "#1a1a1a",
      marquee: "#0d0d0d",
      marqueText: "#707070",
    },
    light: {
      bg: "#ffffff",
      bgSecondary: "#f5f5f5",
      bgTertiary: "#f0f0f0",
      border: "#e0e0e0",
      borderSecondary: "#d0d0d0",
      borderLight: "rgba(0,0,0,0.05)",
      text: "#0a0a0a",
      textSecondary: "#1a1a1a",
      textMuted: "#666666",
      textDisabled: "#c0c0c0",
      textGray: "#888888",
      textDarkGray: "#999999",
      accent: "#00cc6a",
      accentBg: "rgba(0,204,106,0.06)",
      accentBgHover: "rgba(0,204,106,0.12)",
      accentBorder: "#00cc6a",
      scanline: "rgba(0,0,0,0.02)",
      watermark: "#f0f0f0",
      marquee: "#fafafa",
      marqueText: "#999999",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: colors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};
