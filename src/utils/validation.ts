import type { TaskDraft } from "../types";
import { todayIso } from "./date";

export type TaskErrors = Partial<Record<keyof TaskDraft, string>>;

export function validateTask(draft: TaskDraft, today = todayIso()): TaskErrors {
  const errors: TaskErrors = {};
  const title = draft.title.trim();
  const subject = draft.subject.trim();

  if (!title) errors.title = "Enter a task title.";
  else if (title.length > 80)
    errors.title = "Title must be 80 characters or fewer.";

  if (!subject) errors.subject = "Enter a subject.";
  else if (subject.length > 40)
    errors.subject = "Subject must be 40 characters or fewer.";

  if (!draft.dueDate) errors.dueDate = "Choose a due date.";
  else if (draft.dueDate < today)
    errors.dueDate = "Due date cannot be in the past.";

  if (!Number.isInteger(draft.estimatedMinutes)) {
    errors.estimatedMinutes = "Study time must be a whole number.";
  } else if (draft.estimatedMinutes < 15 || draft.estimatedMinutes > 480) {
    errors.estimatedMinutes = "Study time must be between 15 and 480 minutes.";
  }

  return errors;
}
