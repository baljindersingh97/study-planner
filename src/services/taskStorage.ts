import type { StudyTask } from "../types";

export const STORAGE_KEY = "study-planner-tasks";

function isStudyTask(value: unknown): value is StudyTask {
  if (!value || typeof value !== "object") return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.subject === "string" &&
    typeof task.dueDate === "string" &&
    ["low", "medium", "high"].includes(String(task.priority)) &&
    Number.isInteger(task.estimatedMinutes) &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string"
  );
}

export function loadTasks(): StudyTask[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const tasks: unknown = JSON.parse(saved);
    return Array.isArray(tasks) && tasks.every(isStudyTask) ? tasks : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: StudyTask[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
