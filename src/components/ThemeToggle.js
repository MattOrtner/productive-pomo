import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className={`theme-toggle-btn ${theme}`}
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
