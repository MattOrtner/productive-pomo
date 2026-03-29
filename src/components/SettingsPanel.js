import { useState } from "react";

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
  const [formWorkDuration, setFormWorkDuration] = useState(workDuration);
  const [formBreakDuration, setFormBreakDuration] = useState(breakDuration);
  const [formWorkSoundType, setFormWorkSoundType] = useState(workSoundType);
  const [formBreakSoundType, setFormBreakSoundType] = useState(breakSoundType);

  if (!showSettings || isActive) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      isNaN(formWorkDuration) ||
      isNaN(formBreakDuration) ||
      formWorkDuration < 1 ||
      formBreakDuration < 1
    ) {
      alert("Please enter numbers for durations.");
    } else {
      setWorkDuration(formWorkDuration);
      setBreakDuration(formBreakDuration);
      setWorkSoundType(formWorkSoundType);
      setBreakSoundType(formBreakSoundType);
      setShowSettings(false);
    }
  };

  return (
    <div className="settings-panel">
      <form onSubmit={handleSubmit}>
        <h3>Timer Settings</h3>
        <div className="settings-controls">
          <div className="setting-item">
            <label>
              Work Duration:
              <input
                type="number"
                min="1"
                max="60"
                value={formWorkDuration}
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(60, parseInt(e.target.value))
                  );
                  setFormWorkDuration(value);
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
                value={formBreakDuration}
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(30, parseInt(e.target.value) || 1)
                  );
                  setFormBreakDuration(value);
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
                value={formWorkSoundType}
                onChange={(e) => setFormWorkSoundType(e.target.value)}
                className="sound-select"
              >
                {Object.entries(soundOptions.work).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="play-preview-btn"
                onClick={() => playWorkSound(formWorkSoundType)}
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
                value={formBreakSoundType}
                onChange={(e) => setFormBreakSoundType(e.target.value)}
                className="sound-select"
              >
                {Object.entries(soundOptions.break).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="play-preview-btn"
                onClick={() => playBreakSound(formBreakSoundType)}
                title="Preview sound"
              >
                ▶️
              </button>
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Done
        </button>
      </form>
    </div>
  );
};

export default SettingsPanel;
