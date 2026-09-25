import React from "react";
import "./styles/TemplatesSidebar.css";

// White fill with black stroke keeps the icon visible in both light and dark themes
const PlusIcon = () => (
  <svg
    className="merge-icon"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <polygon
      points="9,1 15,1 15,9 23,9 23,15 15,15 15,23 9,23 9,15 1,15 1,9 9,9"
      fill="#fff"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const TemplatesSidebar = ({
  isOpen,
  onToggle,
  templates,
  onLoadTemplate,
  onMergeTemplate,
  onDeleteTemplate,
}) => {
  const workTemplates = templates.filter((t) => t.type === "work");
  const breakTemplates = templates.filter((t) => t.type === "break");

  const formatPreview = (tasks) => {
    if (tasks.length === 0) return "Empty list";
    if (tasks.length <= 2) return tasks.map((t) => t.text).join(", ");
    return `${tasks
      .slice(0, 2)
      .map((t) => t.text)
      .join(", ")} +${tasks.length - 2} more`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className={`templates-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>📋 Saved Lists</h3>
          <button
            className="close-btn"
            onClick={onToggle}
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          {/* Work Templates */}
          <div className="template-section">
            <h4>Work Templates</h4>
            {workTemplates.length === 0 ? (
              <p className="empty-section">No saved work lists yet</p>
            ) : (
              <div className="template-list">
                {workTemplates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-header">
                      <h5>{template.name}</h5>
                      <div className="template-actions">
                        <button
                          className="load-btn"
                          onClick={() => onLoadTemplate(template)}
                          title="Replace current list"
                        >
                          📥
                        </button>
                        <button
                          className="merge-btn"
                          onClick={() => onMergeTemplate(template)}
                          title="Merge with current list"
                        >
                          <PlusIcon />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => onDeleteTemplate(template.id)}
                          title="Delete template"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="template-preview">
                      {formatPreview(template.tasks)}
                    </p>
                    <small className="task-count">
                      {template.tasks.length} task
                      {template.tasks.length !== 1 ? "s" : ""}
                      {template.createdAt &&
                        ` \u2022 Saved ${formatDate(template.createdAt)}`}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Break Templates */}
          <div className="template-section">
            <h4>Break Templates</h4>
            {breakTemplates.length === 0 ? (
              <p className="empty-section">No saved break lists yet</p>
            ) : (
              <div className="template-list">
                {breakTemplates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-header">
                      <h5>{template.name}</h5>
                      <div className="template-actions">
                        <button
                          className="load-btn"
                          onClick={() => onLoadTemplate(template)}
                          title="Replace current list"
                        >
                          📥
                        </button>
                        <button
                          className="merge-btn"
                          onClick={() => onMergeTemplate(template)}
                          title="Merge with current list"
                        >
                          <PlusIcon />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => onDeleteTemplate(template.id)}
                          title="Delete template"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="template-preview">
                      {formatPreview(template.tasks)}
                    </p>
                    <small className="task-count">
                      {template.tasks.length} task
                      {template.tasks.length !== 1 ? "s" : ""}
                      {template.createdAt &&
                        ` \u2022 Saved ${formatDate(template.createdAt)}`}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title="Open saved templates"
        >
          📋
        </button>
      )}
    </>
  );
};

export default TemplatesSidebar;
