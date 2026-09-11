export type Priority = "low" | "medium" | "high";
export type StatusFilter = "all" | "pending" | "completed";
export type SortOption = "due-date" | "priority" | "title";

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: string;
}

export type TaskDraft = Pick<
  StudyTask,
  "title" | "subject" | "dueDate" | "priority" | "estimatedMinutes"
>;

export interface TaskFilters {
  search: string;
  status: StatusFilter;
  subject: string;
  sortBy: SortOption;
}
