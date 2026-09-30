import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./styles/WelcomeModal.css";

const STORAGE_KEY = "pp-welcome-shown";

const WelcomeModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't seen it and isn't already logged in
    if (!user && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, [user]);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const handleSignUp = () => {
    dismiss();
    navigate("/register");
  };

  return (
    <div className="welcome-overlay" onClick={dismiss}>
      <div
        className="welcome-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <div className="welcome-icon">🍅</div>

        <h2 id="welcome-title">Welcome to Productive Pomodoro</h2>
        <p className="welcome-subtitle">
          A smarter way to focus — no account required to get started.
        </p>

        <div className="welcome-tiers">
          <div className="tier tier-free">
            <h4>Free — right now</h4>
            <ul>
              <li>✓ Unlimited timer sessions</li>
              <li>✓ Work &amp; break task lists</li>
              <li>✓ Drag, edit, and reorder tasks</li>
              <li>✓ Save up to 2 list templates per list</li>
            </ul>
          </div>
          <div className="tier tier-account">
            <h4>With a free account</h4>
            <ul>
              <li>✦ Unlimited saved templates</li>
              <li>✦ Cloud backup across devices</li>
              <li>✦ Session history &amp; streaks</li>
              <li>✦ More coming soon…</li>
            </ul>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={handleSignUp}>
            Create Free Account
          </button>
          <button className="btn btn-outline" onClick={dismiss}>
            Start without account
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
