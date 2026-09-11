import type { StudyTask } from "../types";

export function todayIso(date = new Date()): string {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function isOverdue(task: StudyTask, today = todayIso()): boolean {
  return !task.completed && task.dueDate < today;
}
