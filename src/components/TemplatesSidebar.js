import React from "react";
import "./TemplatesSidebar.css";

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
                          🔗
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
                          🔗
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
