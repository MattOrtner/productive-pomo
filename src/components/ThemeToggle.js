// import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import "./styles/ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      className="theme-toggle-slider"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      role="button"
      tabIndex={0}
    >
      <div className={`slider-track ${theme}`}>
        <div className={`slider-thumb ${theme}`}>
          {theme === "dark" ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
