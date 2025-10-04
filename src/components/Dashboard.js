import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  rectIntersection,
  pointerWithin,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Dashboard.css";

// SortableItem component for individual tasks
const SortableItem = ({ task, onToggle, onDelete, onEdit, listType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: task.completed || isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== task.text) {
      onEdit(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSave();
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-item ${task.completed ? "completed" : ""} ${
        isDragging ? "dragging" : ""
      } ${isEditing ? "editing" : ""}`}
    >
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        style={{ cursor: task.completed || isEditing ? "default" : "grab" }}
      >
        ⋮⋮
      </div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        disabled={isEditing}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="task-edit-input"
          autoFocus
        />
      ) : (
        <span
          className="task-text"
          onDoubleClick={() => !task.completed && handleEdit()}
          title="Double-click to edit"
        >
          {task.text}
        </span>
      )}
      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              className="save-btn"
              onMouseDown={handleSaveClick}
              title="Save"
              type="button"
            >
              ✓
            </button>
            <button
              className="cancel-btn"
              onMouseDown={handleCancelClick}
              title="Cancel"
              type="button"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            {!task.completed && (
              <button className="edit-btn" onClick={handleEdit} title="Edit">
                ✎
              </button>
            )}
            <button
              className="delete-btn"
              onClick={() => onDelete(task.id)}
              title="Delete"
            >
              ×
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Droppable container for task lists
const DroppableContainer = ({ id, children, className }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
  });

  const isActive = active?.id && active.id !== id;

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver && isActive ? "drag-over" : ""}`}
      style={{
        minHeight: "100px",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {children}
    </div>
  );
};

const Dashboard = () => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Todo lists state
  const [workTasks, setWorkTasks] = useState([
    { id: "work-1", text: "Complete project documentation", completed: false },
    { id: "work-2", text: "Review pull requests", completed: false },
  ]);
  const [breakTasks, setBreakTasks] = useState([
    { id: "break-1", text: "Do 10 push-ups", completed: false },
    { id: "break-2", text: "Drink water", completed: false },
    { id: "break-3", text: "Take deep breaths", completed: false },
  ]);

  const [newWorkTask, setNewWorkTask] = useState("");
  const [newBreakTask, setNewBreakTask] = useState("");

  const intervalRef = useRef(null);

  // @dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        id: `work-${Date.now()}`,
        text: newWorkTask.trim(),
        completed: false,
      };
      setWorkTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        // Sort tasks: incomplete tasks first, then completed tasks at the bottom
        return updatedTasks.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      });
      setNewWorkTask("");
    }
  };

  const addBreakTask = (e) => {
    e.preventDefault();
    if (newBreakTask.trim()) {
      const newTask = {
        id: `break-${Date.now()}`,
        text: newBreakTask.trim(),
        completed: false,
      };
      setBreakTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        // Sort tasks: incomplete tasks first, then completed tasks at the bottom
        return updatedTasks.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      });
      setNewBreakTask("");
    }
  };

  const toggleWorkTask = (id) => {
    setWorkTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Sort tasks: incomplete tasks first, then completed tasks at the bottom
      return updatedTasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });
  };

  const toggleBreakTask = (id) => {
    setBreakTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Sort tasks: incomplete tasks first, then completed tasks at the bottom
      return updatedTasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });
  };

  const deleteWorkTask = (id) => {
    setWorkTasks(workTasks.filter((task) => task.id !== id));
  };

  const deleteBreakTask = (id) => {
    setBreakTasks(breakTasks.filter((task) => task.id !== id));
  };

  const editWorkTask = (id, newText) => {
    setWorkTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      );
      // Maintain sorting: incomplete tasks first, then completed tasks at the bottom
      return updatedTasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });
  };

  const editBreakTask = (id, newText) => {
    setBreakTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      );
      // Maintain sorting: incomplete tasks first, then completed tasks at the bottom
      return updatedTasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });
  };

  // @dnd-kit drag end handler
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the active task in either list
    const activeTask =
      workTasks.find((task) => task.id === activeId) ||
      breakTasks.find((task) => task.id === activeId);

    if (!activeTask) return;

    // Determine which list the active task is currently in
    const activeInWork = workTasks.some((task) => task.id === activeId);
    const activeInBreak = breakTasks.some((task) => task.id === activeId);

    // Determine which list we're dropping into
    const droppingIntoWork =
      overId === "work-list" || workTasks.some((task) => task.id === overId);
    const droppingIntoBreak =
      overId === "break-list" || breakTasks.some((task) => task.id === overId);

    if (activeInWork && droppingIntoWork) {
      // Reordering within work list
      const oldIndex = workTasks.findIndex((task) => task.id === activeId);
      const newIndex =
        overId === "work-list"
          ? workTasks.length - 1
          : workTasks.findIndex((task) => task.id === overId);

      if (oldIndex !== newIndex) {
        setWorkTasks(arrayMove(workTasks, oldIndex, newIndex));
      }
    } else if (activeInBreak && droppingIntoBreak) {
      // Reordering within break list
      const oldIndex = breakTasks.findIndex((task) => task.id === activeId);
      const newIndex =
        overId === "break-list"
          ? breakTasks.length - 1
          : breakTasks.findIndex((task) => task.id === overId);

      if (oldIndex !== newIndex) {
        setBreakTasks(arrayMove(breakTasks, oldIndex, newIndex));
      }
    } else if (activeInWork && droppingIntoBreak) {
      // Move from work to break
      setWorkTasks((prev) => prev.filter((task) => task.id !== activeId));

      if (overId === "break-list" || breakTasks.length === 0) {
        setBreakTasks((prev) => [...prev, activeTask]);
      } else {
        const insertIndex = breakTasks.findIndex((task) => task.id === overId);
        setBreakTasks((prev) => {
          const newTasks = [...prev];
          newTasks.splice(insertIndex, 0, activeTask);
          return newTasks;
        });
      }
    } else if (activeInBreak && droppingIntoWork) {
      // Move from break to work
      setBreakTasks((prev) => prev.filter((task) => task.id !== activeId));

      if (overId === "work-list" || workTasks.length === 0) {
        setWorkTasks((prev) => [...prev, activeTask]);
      } else {
        const insertIndex = workTasks.findIndex((task) => task.id === overId);
        setWorkTasks((prev) => {
          const newTasks = [...prev];
          newTasks.splice(insertIndex, 0, activeTask);
          return newTasks;
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Productive Pomodoro</h1>
          <div className="session-counter">Sessions completed: {sessions}</div>
          <Link to="/" className="btn btn-outline btn-sm">
            Logout
          </Link>
        </div>

        <div className="dashboard-content">
          <div className={`main-layout ${isActive ? "focus-mode" : ""}`}>
            {/* Timer Section */}
            <div className="timer-section">
              <div
                className={`timer-card ${isBreak ? "break-mode" : "work-mode"}`}
              >
                <h2>{isBreak ? "Break Time 🎯" : "Focus Time 🍅"}</h2>
                <div className="timer-display">{formatTime(timeLeft)}</div>
                <div className="timer-controls">
                  <button
                    className={`btn ${
                      isActive ? "btn-secondary" : "btn-primary"
                    }`}
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
              {/* Work Tasks - Hidden during break time */}
              {!(isActive && isBreak) && (
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

                  <DroppableContainer id="work-list" className="task-list">
                    <SortableContext
                      items={workTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {workTasks.length === 0 && (
                        <div className="empty-list-message">
                          No tasks yet. Add one above!
                        </div>
                      )}
                      {workTasks.map((task) => (
                        <SortableItem
                          key={task.id}
                          task={task}
                          onToggle={toggleWorkTask}
                          onDelete={deleteWorkTask}
                          onEdit={editWorkTask}
                          listType="work"
                        />
                      ))}
                    </SortableContext>
                  </DroppableContainer>
                </div>
              )}

              {/* Break Activities - Hidden during focus time, shown during break time and when timer is inactive */}
              {!(isActive && !isBreak) && (
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

                  <DroppableContainer id="break-list" className="task-list">
                    <SortableContext
                      items={breakTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {breakTasks.length === 0 && (
                        <div className="empty-list-message">
                          No activities yet. Add one above!
                        </div>
                      )}
                      {breakTasks.map((task) => (
                        <SortableItem
                          key={task.id}
                          task={task}
                          onToggle={toggleBreakTask}
                          onDelete={deleteBreakTask}
                          onEdit={editBreakTask}
                          listType="break"
                        />
                      ))}
                    </SortableContext>
                  </DroppableContainer>
                </div>
              )}
            </div>
          </div>

          <div className="drag-instructions">
            <small>
              {isActive && !isBreak
                ? "🎯 Focus Time: Complete your current tasks!"
                : isActive && isBreak
                ? "🌟 Break Time: Enjoy your break activities!"
                : "💡 Tip: Drag tasks to reorder them or move between lists"}
            </small>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Dashboard;
