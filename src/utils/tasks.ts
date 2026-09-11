import type { StudyTask, TaskFilters } from "../types";

const priorityOrder = { high: 0, medium: 1, low: 2 };

export function getVisibleTasks(
  tasks: StudyTask[],
  filters: TaskFilters,
): StudyTask[] {
  const term = filters.search.trim().toLowerCase();
  const result = tasks.filter((task) => {
    const matchesSearch =
      !term ||
      task.title.toLowerCase().includes(term) ||
      task.subject.toLowerCase().includes(term);
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "completed" && task.completed) ||
      (filters.status === "pending" && !task.completed);
    const matchesSubject =
      filters.subject === "all" || task.subject === filters.subject;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  return result.sort((a, b) => {
    if (filters.sortBy === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (filters.sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return a.dueDate.localeCompare(b.dueDate);
  });
}

export function getSubjects(tasks: StudyTask[]): string[] {
  return [...new Set(tasks.map((task) => task.subject))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getTaskStats(tasks: StudyTask[]) {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const remainingMinutes = tasks
    .filter((task) => !task.completed)
    .reduce((total, task) => total + task.estimatedMinutes, 0);
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  return {
    total: tasks.length,
    completed,
    pending,
    remainingMinutes,
    progress,
  };
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}
