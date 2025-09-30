import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Todo lists state
  const [workTasks, setWorkTasks] = useState([
    { id: 1, text: "Complete project documentation", completed: false },
    { id: 2, text: "Review pull requests", completed: false },
  ]);
  const [breakTasks, setBreakTasks] = useState([
    { id: 1, text: "Do 10 push-ups", completed: false },
    { id: 2, text: "Drink water", completed: false },
    { id: 3, text: "Take deep breaths", completed: false },
  ]);

  const [newWorkTask, setNewWorkTask] = useState("");
  const [newBreakTask, setNewBreakTask] = useState("");

  const intervalRef = useRef(null);

  // Timer effects
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Timer finished
            setIsActive(false);
            if (isBreak) {
              setIsBreak(false);
              setTimeLeft(25 * 60); // Back to work timer
            } else {
              setSessions((prev) => prev + 1);
              setIsBreak(true);
              setTimeLeft(5 * 60); // Break timer
            }
            // Play notification sound or show alert
            alert(
              isBreak
                ? "Break time over! Back to work!"
                : "Work session complete! Time for a break!"
            );
            return time - 1;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isBreak]);

  // Timer functions
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    } else {
      setSessions((prev) => prev + 1);
      setIsBreak(true);
      setTimeLeft(5 * 60);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Todo functions
  const addWorkTask = (e) => {
    e.preventDefault();
    if (newWorkTask.trim()) {
      const newTask = {
        id: Date.now(),
        text: newWorkTask.trim(),
        completed: false,
      };
      setWorkTasks([...workTasks, newTask]);
      setNewWorkTask("");
    }
  };

  const addBreakTask = (e) => {
    e.preventDefault();
    if (newBreakTask.trim()) {
      const newTask = {
        id: Date.now(),
        text: newBreakTask.trim(),
        completed: false,
      };
      setBreakTasks([...breakTasks, newTask]);
      setNewBreakTask("");
    }
  };

  const toggleWorkTask = (id) => {
    setWorkTasks(
      workTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleBreakTask = (id) => {
    setBreakTasks(
      breakTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteWorkTask = (id) => {
    setWorkTasks(workTasks.filter((task) => task.id !== id));
  };

  const deleteBreakTask = (id) => {
    setBreakTasks(breakTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Productive Pomodoro</h1>
        <div className="session-counter">Sessions completed: {sessions}</div>
        <Link to="/" className="btn btn-outline btn-sm">
          Logout
        </Link>
      </div>

      <div className="dashboard-content">
        {/* Timer Section */}
        <div className="timer-section">
          <div className={`timer-card ${isBreak ? "break-mode" : "work-mode"}`}>
            <h2>{isBreak ? "Break Time 🎯" : "Focus Time 🍅"}</h2>
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
              <button
                className={`btn ${isActive ? "btn-secondary" : "btn-primary"}`}
                onClick={toggleTimer}
              >
                {isActive ? "Pause" : "Start"}
              </button>
              <button className="btn btn-outline" onClick={resetTimer}>
                Reset
              </button>
              <button className="btn btn-accent" onClick={skipTimer}>
                Skip
              </button>
            </div>
          </div>
        </div>

        {/* Todo Lists Section */}
        <div className="todo-section">
          {/* Work Tasks */}
          <div className="todo-column">
            <div className="todo-header">
              <h3>🎯 Current Tasks</h3>
              <small>Focus on these during work sessions</small>
            </div>
            <form onSubmit={addWorkTask} className="add-task-form">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newWorkTask}
                onChange={(e) => setNewWorkTask(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Add
              </button>
            </form>
            <div className="task-list">
              {workTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleWorkTask(task.id)}
                  />
                  <span className="task-text">{task.text}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteWorkTask(task.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Break Activities */}
          <div className="todo-column">
            <div className="todo-header">
              <h3>🌟 Break Activities</h3>
              <small>Recharge with these during breaks</small>
            </div>
            <form onSubmit={addBreakTask} className="add-task-form">
              <input
                type="text"
                placeholder="Add a break activity..."
                value={newBreakTask}
                onChange={(e) => setNewBreakTask(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                Add
              </button>
            </form>
            <div className="task-list">
              {breakTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleBreakTask(task.id)}
                  />
                  <span className="task-text">{task.text}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteBreakTask(task.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
