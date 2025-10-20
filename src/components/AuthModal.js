import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

const AuthModal = ({ onClose }) => {
  const [view, setView] = useState("landing"); // 'landing', 'login', 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Login attempt:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/dashboard");
      onClose();
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Register attempt:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/dashboard");
      onClose();
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderLanding = () => (
    <div className="modal-landing">
      <h1 className="modal-title">Productive Pomodoro</h1>
      <p className="modal-subtitle">
        Boost your focus with a smart timer and purposeful break activities.
        Combine the power of the Pomodoro technique with mindful breaks to
        maximize your productivity and well-being.
      </p>
      <div className="modal-buttons">
        <button onClick={() => setView("login")} className="btn btn-primary">
          Sign In
        </button>
        <button onClick={() => setView("register")} className="btn btn-outline">
          Get Started
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="modal-auth">
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">
        Sign in to continue your productive journey
      </p>

      {error && <div className="error-message">{error}</div>}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mb-3"
          style={{ width: "100%" }}
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <p className="text-center text-muted">
        Don't have an account?{" "}
        <button onClick={() => setView("register")} className="link-button">
          Create one here
        </button>
      </p>

      <p className="text-center mt-3">
        <button
          onClick={() => setView("landing")}
          className="link-button"
          style={{ fontSize: "14px" }}
        >
          ← Back to Home
        </button>
      </p>
    </div>
  );

  const renderRegister = () => (
    <div className="modal-auth">
      <h1 className="auth-title">Create Account</h1>
      <p className="auth-subtitle">Join us to start your productive journey</p>

      {error && <div className="error-message">{error}</div>}

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mb-3"
          style={{ width: "100%" }}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <p className="text-center text-muted">
        Already have an account?{" "}
        <button onClick={() => setView("login")} className="link-button">
          Sign in here
        </button>
      </p>

      <p className="text-center mt-3">
        <button
          onClick={() => setView("landing")}
          className="link-button"
          style={{ fontSize: "14px" }}
        >
          ← Back to Home
        </button>
      </p>
    </div>
  );

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {view === "landing" && renderLanding()}
        {view === "login" && renderLogin()}
        {view === "register" && renderRegister()}
      </div>
    </div>
  );
};

export default AuthModal;
