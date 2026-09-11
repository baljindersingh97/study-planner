import { useEffect, useState, type FormEvent } from "react";
import type { StudyTask, TaskDraft } from "../types";
import { todayIso } from "../utils/date";
import { validateTask, type TaskErrors } from "../utils/validation";

interface TaskFormProps {
  editingTask: StudyTask | null;
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
}

const emptyDraft = (): TaskDraft => ({
  title: "",
  subject: "",
  dueDate: todayIso(),
  priority: "medium",
  estimatedMinutes: 60,
});

export function TaskForm({ editingTask, onSubmit, onCancel }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [errors, setErrors] = useState<TaskErrors>({});

  useEffect(() => {
    if (editingTask) {
      setDraft({
        title: editingTask.title,
        subject: editingTask.subject,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        estimatedMinutes: editingTask.estimatedMinutes,
      });
    } else {
      setDraft(emptyDraft());
    }
    setErrors({});
  }, [editingTask]);

  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateTask(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({
      ...draft,
      title: draft.title.trim(),
      subject: draft.subject.trim(),
    });
    if (!editingTask) setDraft(emptyDraft());
  }

  return (
    <section className="panel form-panel">
      <h2>{editingTask ? "Edit study task" : "Add a study task"}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field full-width">
          <label htmlFor="title">Task title</label>
          <input
            id="title"
            value={draft.title}
            maxLength={81}
            onChange={(event) => update("title", event.target.value)}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <span className="error" id="title-error">
              {errors.title}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="subject">Task subject</label>
          <input
            id="subject"
            value={draft.subject}
            maxLength={41}
            onChange={(event) => update("subject", event.target.value)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && (
            <span className="error" id="subject-error">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="due-date">Due date</label>
          <input
            id="due-date"
            type="date"
            min={todayIso()}
            value={draft.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
            aria-describedby={errors.dueDate ? "due-date-error" : undefined}
          />
          {errors.dueDate && (
            <span className="error" id="due-date-error">
              {errors.dueDate}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={draft.priority}
            onChange={(event) =>
              update("priority", event.target.value as TaskDraft["priority"])
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="study-time">Study time (minutes)</label>
          <input
            id="study-time"
            type="number"
            min="15"
            max="480"
            step="1"
            value={draft.estimatedMinutes}
            onChange={(event) =>
              update("estimatedMinutes", Number(event.target.value))
            }
            aria-describedby={
              errors.estimatedMinutes ? "study-time-error" : undefined
            }
          />
          {errors.estimatedMinutes && (
            <span className="error" id="study-time-error">
              {errors.estimatedMinutes}
            </span>
          )}
        </div>

        <div className="form-actions full-width">
          <button className="primary" type="submit">
            {editingTask ? "Save changes" : "Add study task"}
          </button>
          {editingTask && (
            <button className="secondary" type="button" onClick={onCancel}>
              Cancel editing
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
