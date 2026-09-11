import { tasks } from "../test/fixtures";
import type { TaskFilters } from "../types";
import {
  formatMinutes,
  getSubjects,
  getTaskStats,
  getVisibleTasks,
} from "./tasks";

const filters: TaskFilters = {
  search: "",
  status: "all",
  subject: "all",
  sortBy: "due-date",
};

describe("task filtering and summaries", () => {
  test("UT-05 searches task titles and subjects without case sensitivity", () => {
    expect(getVisibleTasks(tasks, { ...filters, search: "ALGEBRA" })).toEqual([
      tasks[0],
    ]);
    expect(getVisibleTasks(tasks, { ...filters, search: "biology" })).toEqual([
      tasks[1],
    ]);
    expect(getVisibleTasks(tasks, { ...filters, search: "chemistry" })).toEqual(
      [],
    );
  });

  test("UT-06 filters tasks by pending and completed status", () => {
    expect(
      getVisibleTasks(tasks, { ...filters, status: "completed" }).map(
        (task) => task.id,
      ),
    ).toEqual(["task-2"]);
    expect(
      getVisibleTasks(tasks, { ...filters, status: "pending" }).map(
        (task) => task.id,
      ),
    ).toEqual(["task-1", "task-3"]);
  });

  test("UT-07 filters tasks by subject and lists unique subjects", () => {
    expect(
      getVisibleTasks(tasks, { ...filters, subject: "History" }).map(
        (task) => task.id,
      ),
    ).toEqual(["task-3"]);
    expect(getSubjects([...tasks, { ...tasks[0], id: "task-4" }])).toEqual([
      "Biology",
      "History",
      "Mathematics",
    ]);
  });

  test("UT-08 sorts by due date, priority and title", () => {
    expect(getVisibleTasks(tasks, filters).map((task) => task.id)).toEqual([
      "task-2",
      "task-1",
      "task-3",
    ]);
    expect(
      getVisibleTasks(tasks, { ...filters, sortBy: "priority" }).map(
        (task) => task.id,
      ),
    ).toEqual(["task-2", "task-1", "task-3"]);
    expect(
      getVisibleTasks(tasks, { ...filters, sortBy: "title" }).map(
        (task) => task.id,
      ),
    ).toEqual(["task-3", "task-2", "task-1"]);
  });

  test("UT-09 calculates dashboard statistics and time display", () => {
    expect(getTaskStats(tasks)).toEqual({
      total: 3,
      completed: 1,
      pending: 2,
      remainingMinutes: 180,
      progress: 33,
    });
    expect(getTaskStats([]).progress).toBe(0);
    expect(formatMinutes(45)).toBe("45m");
    expect(formatMinutes(60)).toBe("1h");
    expect(formatMinutes(135)).toBe("2h 15m");
  });
});
