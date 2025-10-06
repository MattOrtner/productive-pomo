import React from "react";

const SettingsPanel = ({
  showSettings,
  isActive,
  workDuration,
  setWorkDuration,
  breakDuration,
  setBreakDuration,
  workSoundType,
  setWorkSoundType,
  breakSoundType,
  setBreakSoundType,
  soundOptions,
  playWorkSound,
  playBreakSound,
  setShowSettings,
}) => {
  if (!showSettings || isActive) {
    return null;
  }

  return (
    <div className="settings-panel">
      <h3>Timer Settings</h3>
      <div className="settings-controls">
        <div className="setting-item">
          <label>
            Work Duration:
            <input
              type="number"
              min="1"
              max="60"
              value={workDuration}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(60, parseInt(e.target.value) || 1)
                );
                setWorkDuration(value);
              }}
              className="duration-input"
            />
            <span>min</span>
          </label>
        </div>

        <div className="setting-item">
          <label>
            Break Duration:
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(30, parseInt(e.target.value) || 1)
                );
                setBreakDuration(value);
              }}
              className="duration-input"
            />
            <span>min</span>
          </label>
        </div>

        <div className="setting-item">
          <label>
            Work Complete Sound:
            <select
              value={workSoundType}
              onChange={(e) => setWorkSoundType(e.target.value)}
              className="sound-select"
            >
              {Object.entries(soundOptions.work).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button
              className="play-preview-btn"
              onClick={() => playWorkSound(workSoundType)}
              title="Preview sound"
            >
              ▶️
            </button>
          </label>
        </div>

        <div className="setting-item">
          <label>
            Break Complete Sound:
            <select
              value={breakSoundType}
              onChange={(e) => setBreakSoundType(e.target.value)}
              className="sound-select"
            >
              {Object.entries(soundOptions.break).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button
              className="play-preview-btn"
              onClick={() => playBreakSound(breakSoundType)}
              title="Preview sound"
            >
              ▶️
            </button>
          </label>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={() => setShowSettings(false)}
      >
        Done
      </button>
    </div>
  );
};

export default SettingsPanel;
