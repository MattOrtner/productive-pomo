import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";

const DashboardHeader = ({ sessions }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <div className="dashboard-header">
      <h1>Productive Pomodoro</h1>
      <div className="session-counter">Sessions completed: {sessions}</div>
      <div className="header-actions">
        <ThemeToggle />
        {user ? (
          <button
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
            title={`Signed in as ${user.email}`}
          >
            Sign Out
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
