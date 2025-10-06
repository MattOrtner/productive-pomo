import React from "react";
import { Link } from "react-router-dom";

const DashboardHeader = ({ sessions }) => {
  return (
    <div className="dashboard-header">
      <h1>Productive Pomodoro</h1>
      <div className="session-counter">Sessions completed: {sessions}</div>
      <Link to="/" className="btn btn-outline btn-sm">
        Logout
      </Link>
    </div>
  );
};

export default DashboardHeader;
