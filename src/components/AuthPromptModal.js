import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AuthModal.css";

const FREE_TEMPLATE_LIMIT = 2;

const AuthPromptModal = ({ show, listType, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const listLabel = listType === "work" ? "work" : "break";

  const handleSignUp = () => {
    onClose();
    navigate("/register");
  };

  const handleSignIn = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "8px",
            fontSize: "2.5rem",
          }}
        >
          🔒
        </div>

        <h2
          id="auth-prompt-title"
          style={{
            textAlign: "center",
            marginBottom: "8px",
            fontSize: "1.4rem",
          }}
        >
          Template limit reached
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "var(--medium-gray)",
            marginBottom: "24px",
          }}
        >
          You've used all {FREE_TEMPLATE_LIMIT} free saves for your {listLabel}{" "}
          list. Create a free account for unlimited templates and cloud backup
          across all your devices.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            onClick={handleSignUp}
          >
            Create Free Account
          </button>
          <button
            className="btn btn-outline"
            style={{ width: "100%", padding: "12px" }}
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <button
            className="btn"
            style={{
              width: "100%",
              padding: "10px",
              background: "transparent",
              color: "var(--medium-gray)",
              fontSize: "0.875rem",
            }}
            onClick={onClose}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
