import React, { useState, useEffect, useRef, useCallback } from "react";
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
import DashboardHeader from "./DashboardHeader";
import SettingsPanel from "./SettingsPanel";
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
  const [workDuration, setWorkDuration] = useState(25); // Work duration in minutes
  const [breakDuration, setBreakDuration] = useState(5); // Break duration in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false); // Settings menu visibility

  // Sound settings state
  const [workSoundType, setWorkSoundType] = useState("bell");
  const [breakSoundType, setBreakSoundType] = useState("alert");

  const soundOptions = {
    work: {
      bell: "Calming Bell",
      chime: "Gentle Chime",
      ding: "Soft Ding",
      tone: "Meditation Tone",
      gong: "Tibetan Gong",
    },
    break: {
      alert: "Alert Bell",
      chirp: "Bird Chirp",
      beep: "Digital Beep",
      ring: "Phone Ring",
      whistle: "Soft Whistle",
    },
  };

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

  // Sound functions with multiple options
  const playWorkSound = useCallback(
    (soundType = workSoundType) => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        switch (soundType) {
          case "bell":
            // Calming dual-tone bell (C5 and E5)
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            osc1.frequency.setValueAtTime(523.25, audioContext.currentTime);
            osc2.frequency.setValueAtTime(659.25, audioContext.currentTime);
            osc1.type = "sine";
            osc2.type = "sine";
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.15,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1.5
            );
            osc1.start(audioContext.currentTime);
            osc2.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 1.5);
            osc2.stop(audioContext.currentTime + 1.5);
            break;

          case "chime":
            // Gentle wind chime (F4, A4, C5)
            [349.23, 440, 523.25].forEach((freq, i) => {
              const osc = audioContext.createOscillator();
              osc.frequency.setValueAtTime(freq, audioContext.currentTime);
              osc.type = "sine";
              osc.connect(gainNode);
              gainNode.gain.setValueAtTime(
                0,
                audioContext.currentTime + i * 0.2
              );
              gainNode.gain.linearRampToValueAtTime(
                0.1,
                audioContext.currentTime + i * 0.2 + 0.1
              );
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + i * 0.2 + 1.5
              );
              osc.start(audioContext.currentTime + i * 0.2);
              osc.stop(audioContext.currentTime + i * 0.2 + 1.5);
            });
            break;

          case "ding":
            // Soft single tone ding (G4)
            const dingOsc = audioContext.createOscillator();
            dingOsc.frequency.setValueAtTime(392, audioContext.currentTime);
            dingOsc.type = "sine";
            dingOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1
            );
            dingOsc.start(audioContext.currentTime);
            dingOsc.stop(audioContext.currentTime + 1);
            break;

          case "tone":
            // Meditation bowl tone (low frequency)
            const toneOsc = audioContext.createOscillator();
            toneOsc.frequency.setValueAtTime(256, audioContext.currentTime);
            toneOsc.type = "sine";
            toneOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.15,
              audioContext.currentTime + 0.3
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 3
            );
            toneOsc.start(audioContext.currentTime);
            toneOsc.stop(audioContext.currentTime + 3);
            break;

          case "gong":
            // Tibetan gong (multiple harmonics)
            [200, 300, 400].forEach((freq, i) => {
              const osc = audioContext.createOscillator();
              osc.frequency.setValueAtTime(freq, audioContext.currentTime);
              osc.type = "sine";
              osc.connect(gainNode);
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.linearRampToValueAtTime(
                0.1 - i * 0.02,
                audioContext.currentTime + 0.2
              );
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 4
              );
              osc.start(audioContext.currentTime);
              osc.stop(audioContext.currentTime + 4);
            });
            break;

          default:
            // Fall back to bell
            const defaultOsc1 = audioContext.createOscillator();
            const defaultOsc2 = audioContext.createOscillator();
            defaultOsc1.frequency.setValueAtTime(
              523.25,
              audioContext.currentTime
            );
            defaultOsc2.frequency.setValueAtTime(
              659.25,
              audioContext.currentTime
            );
            defaultOsc1.type = "sine";
            defaultOsc2.type = "sine";
            defaultOsc1.connect(gainNode);
            defaultOsc2.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.15,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1.5
            );
            defaultOsc1.start(audioContext.currentTime);
            defaultOsc2.start(audioContext.currentTime);
            defaultOsc1.stop(audioContext.currentTime + 1.5);
            defaultOsc2.stop(audioContext.currentTime + 1.5);
        }
      } catch (error) {
        console.log("Audio not supported:", error);
      }
    },
    [workSoundType]
  );

  const playBreakSound = useCallback(
    (soundType = breakSoundType) => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        switch (soundType) {
          case "alert":
            // Higher pitched alert bell (A5 and C6)
            const osc1 = audioContext.createOscillator();
            osc1.frequency.setValueAtTime(880, audioContext.currentTime);
            osc1.type = "sine";
            osc1.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.8
            );
            osc1.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 0.8);

            // Add a second chime for emphasis
            setTimeout(() => {
              const osc2 = audioContext.createOscillator();
              const gain2 = audioContext.createGain();
              osc2.frequency.setValueAtTime(1046.5, audioContext.currentTime);
              osc2.type = "sine";
              osc2.connect(gain2);
              gain2.connect(audioContext.destination);
              gain2.gain.setValueAtTime(0, audioContext.currentTime);
              gain2.gain.linearRampToValueAtTime(
                0.15,
                audioContext.currentTime + 0.05
              );
              gain2.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.6
              );
              osc2.start(audioContext.currentTime);
              osc2.stop(audioContext.currentTime + 0.6);
            }, 200);
            break;

          case "chirp":
            // Bird-like chirp
            const chirpOsc = audioContext.createOscillator();
            chirpOsc.frequency.setValueAtTime(1200, audioContext.currentTime);
            chirpOsc.frequency.linearRampToValueAtTime(
              800,
              audioContext.currentTime + 0.1
            );
            chirpOsc.type = "sine";
            chirpOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.02
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.3
            );
            chirpOsc.start(audioContext.currentTime);
            chirpOsc.stop(audioContext.currentTime + 0.3);

            // Second chirp
            setTimeout(() => {
              const chirp2 = audioContext.createOscillator();
              const gain2 = audioContext.createGain();
              chirp2.frequency.setValueAtTime(1000, audioContext.currentTime);
              chirp2.frequency.linearRampToValueAtTime(
                700,
                audioContext.currentTime + 0.1
              );
              chirp2.type = "sine";
              chirp2.connect(gain2);
              gain2.connect(audioContext.destination);
              gain2.gain.setValueAtTime(0, audioContext.currentTime);
              gain2.gain.linearRampToValueAtTime(
                0.2,
                audioContext.currentTime + 0.02
              );
              gain2.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.3
              );
              chirp2.start(audioContext.currentTime);
              chirp2.stop(audioContext.currentTime + 0.3);
            }, 200);
            break;

          case "beep":
            // Digital beep pattern
            [1000, 1000, 1000].forEach((freq, i) => {
              setTimeout(() => {
                const beepOsc = audioContext.createOscillator();
                const beepGain = audioContext.createGain();
                beepOsc.frequency.setValueAtTime(
                  freq,
                  audioContext.currentTime
                );
                beepOsc.type = "square";
                beepOsc.connect(beepGain);
                beepGain.connect(audioContext.destination);
                beepGain.gain.setValueAtTime(0.15, audioContext.currentTime);
                beepGain.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioContext.currentTime + 0.15
                );
                beepOsc.start(audioContext.currentTime);
                beepOsc.stop(audioContext.currentTime + 0.15);
              }, i * 200);
            });
            break;

          case "ring":
            // Phone ring pattern
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                const ringOsc1 = audioContext.createOscillator();
                const ringOsc2 = audioContext.createOscillator();
                const ringGain = audioContext.createGain();
                ringOsc1.frequency.setValueAtTime(
                  440,
                  audioContext.currentTime
                );
                ringOsc2.frequency.setValueAtTime(
                  480,
                  audioContext.currentTime
                );
                ringOsc1.type = "sine";
                ringOsc2.type = "sine";
                ringOsc1.connect(ringGain);
                ringOsc2.connect(ringGain);
                ringGain.connect(audioContext.destination);
                ringGain.gain.setValueAtTime(0.1, audioContext.currentTime);
                ringGain.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioContext.currentTime + 0.3
                );
                ringOsc1.start(audioContext.currentTime);
                ringOsc2.start(audioContext.currentTime);
                ringOsc1.stop(audioContext.currentTime + 0.3);
                ringOsc2.stop(audioContext.currentTime + 0.3);
              }, i * 400);
            }
            break;

          case "whistle":
            // Soft whistle
            const whistleOsc = audioContext.createOscillator();
            whistleOsc.frequency.setValueAtTime(2000, audioContext.currentTime);
            whistleOsc.frequency.linearRampToValueAtTime(
              1500,
              audioContext.currentTime + 0.5
            );
            whistleOsc.type = "sine";
            whistleOsc.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.1,
              audioContext.currentTime + 0.1
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.8
            );
            whistleOsc.start(audioContext.currentTime);
            whistleOsc.stop(audioContext.currentTime + 0.8);
            break;

          default:
            // Fall back to alert
            const defaultOsc1 = audioContext.createOscillator();
            defaultOsc1.frequency.setValueAtTime(880, audioContext.currentTime);
            defaultOsc1.type = "sine";
            defaultOsc1.connect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 0.05
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.8
            );
            defaultOsc1.start(audioContext.currentTime);
            defaultOsc1.stop(audioContext.currentTime + 0.8);
        }
      } catch (error) {
        console.log("Audio not supported:", error);
      }
    },
    [breakSoundType]
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
              setTimeLeft(workDuration * 60); // Back to work timer
              playBreakSound(); // Higher pitched bell for break end
            } else {
              setSessions((prev) => prev + 1);
              setIsBreak(true);
              setTimeLeft(breakDuration * 60); // Break timer
              playWorkSound(); // Calming sound for work end
            }
            return time - 1;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [
    isActive,
    isBreak,
    workDuration,
    breakDuration,
    playBreakSound,
    playWorkSound,
  ]);

  // Sync timeLeft with duration changes when timer is not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(isBreak ? breakDuration * 60 : workDuration * 60);
    }
  }, [workDuration, breakDuration, isBreak, isActive]);

  // Timer functions
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? breakDuration * 60 : workDuration * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(workDuration * 60);
    } else {
      setSessions((prev) => prev + 1);
      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
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
        <DashboardHeader sessions={sessions} />

        <div className="dashboard-content">
          <div className={`main-layout ${isActive ? "focus-mode" : ""}`}>
            {/* Timer Section */}
            <div className="timer-section">
              <div
                className={`timer-card ${isBreak ? "break-mode" : "work-mode"}`}
              >
                {/* Settings Menu Button */}
                <button
                  className="settings-btn"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Timer Settings"
                  disabled={isActive}
                >
                  ⚙️
                </button>

                {/* Settings Panel */}
                <SettingsPanel
                  showSettings={showSettings}
                  isActive={isActive}
                  workDuration={workDuration}
                  setWorkDuration={setWorkDuration}
                  breakDuration={breakDuration}
                  setBreakDuration={setBreakDuration}
                  workSoundType={workSoundType}
                  setWorkSoundType={setWorkSoundType}
                  breakSoundType={breakSoundType}
                  setBreakSoundType={setBreakSoundType}
                  soundOptions={soundOptions}
                  playWorkSound={playWorkSound}
                  playBreakSound={playBreakSound}
                  setShowSettings={setShowSettings}
                />

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
