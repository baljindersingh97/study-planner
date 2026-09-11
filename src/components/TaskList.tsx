import type { StudyTask } from "../types";
import { formatDate, isOverdue } from "../utils/date";
import { formatMinutes } from "../utils/tasks";

interface TaskListProps {
  tasks: StudyTask[];
  onToggle: (id: string) => void;
  onEdit: (task: StudyTask) => void;
  onDelete: (task: StudyTask) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>Add a study task or change the filters.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article
          className={`task-card ${task.completed ? "completed" : ""}`}
          key={task.id}
        >
          <button
            className="check-button"
            type="button"
            aria-label={
              task.completed
                ? `Mark ${task.title} as pending`
                : `Mark ${task.title} as completed`
            }
            onClick={() => onToggle(task.id)}
          >
            {task.completed ? "✓" : ""}
          </button>

          <div className="task-content">
            <div className="task-heading">
              <h3>{task.title}</h3>
              <span className={`priority ${task.priority}`}>
                {task.priority}
              </span>
              {isOverdue(task) && <span className="overdue">Overdue</span>}
            </div>
            <p>{task.subject}</p>
            <div className="task-meta">
              <span>Due {formatDate(task.dueDate)}</span>
              <span>{formatMinutes(task.estimatedMinutes)}</span>
              <span>{task.completed ? "Completed" : "Pending"}</span>
            </div>
          </div>

          <div className="task-actions">
            <button
              className="secondary"
              type="button"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button
              className="danger"
              type="button"
              onClick={() => onDelete(task)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
