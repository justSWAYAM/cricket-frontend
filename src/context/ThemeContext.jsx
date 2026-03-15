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
    if (saved === "dark" || saved === "light") return saved;
    return "light";
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
      bg: "#10151c",
      bgSecondary: "#151c25",
      bgTertiary: "#1b2430",
      border: "#2a3645",
      borderSecondary: "#3b4a5d",
      borderLight: "rgba(195,215,240,0.11)",
      text: "#f7fbff",
      textSecondary: "#eaf2fb",
      textMuted: "#b2c0d1",
      textDisabled: "#8ea0b4",
      textGray: "#a7b6c8",
      textDarkGray: "#8ea0b4",
      accent: "#33d28f",
      accentBg: "rgba(51,210,143,0.08)",
      accentBgHover: "rgba(51,210,143,0.16)",
      accentBorder: "#33d28f",
      scanline: "rgba(0,0,0,0.02)",
      watermark: "#2a3442",
      marquee: "#17202b",
      marqueText: "#a2b1c3",
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
