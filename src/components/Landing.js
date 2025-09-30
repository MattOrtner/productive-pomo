import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Productive Pomodoro</h1>
        <p className="landing-subtitle">
          Boost your focus with a smart timer and purposeful break activities.
          Combine the power of the Pomodoro technique with mindful breaks to
          maximize your productivity and well-being.
        </p>
        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-outline">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
