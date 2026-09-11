import type { StudyTask } from "../types";

export const tasks: StudyTask[] = [
  {
    id: "task-1",
    title: "Read algebra chapter",
    subject: "Mathematics",
    dueDate: "2099-06-03",
    priority: "medium",
    estimatedMinutes: 60,
    completed: false,
    createdAt: "2099-06-01T09:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Prepare biology notes",
    subject: "Biology",
    dueDate: "2099-06-02",
    priority: "high",
    estimatedMinutes: 90,
    completed: true,
    createdAt: "2099-06-01T10:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Draft history essay",
    subject: "History",
    dueDate: "2099-06-04",
    priority: "low",
    estimatedMinutes: 120,
    completed: false,
    createdAt: "2099-06-01T11:00:00.000Z",
  },
];
