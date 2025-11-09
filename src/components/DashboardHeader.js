import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const DashboardHeader = ({ sessions }) => {
  return (
    <div className="dashboard-header">
      <h1>Productive Pomodoro</h1>
      <div className="session-counter">Sessions completed: {sessions}</div>
      <ThemeToggle />
      {/* <Link to="/" className="btn btn-outline btn-sm">
        Logout
      </Link> */}
    </div>
  );
};

export default DashboardHeader;
