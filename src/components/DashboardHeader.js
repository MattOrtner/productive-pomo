import ThemeToggle from "./ThemeToggle";

const DashboardHeader = ({ sessions }) => {
  return (
    <div className="dashboard-header">
      <h1>Productive Pomodoro</h1>
      <div className="session-counter">Sessions completed: {sessions}</div>
      <ThemeToggle />
    </div>
  );
};

export default DashboardHeader;
