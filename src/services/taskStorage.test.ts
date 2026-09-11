import { tasks } from "../test/fixtures";
import { loadTasks, saveTasks, STORAGE_KEY } from "./taskStorage";

describe("task storage", () => {
  test("UT-12 saves and loads tasks", () => {
    saveTasks(tasks);
    expect(loadTasks()).toEqual(tasks);
  });

  test("UT-13 safely handles empty, malformed and non-array data", () => {
    expect(loadTasks()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, "not-json");
    expect(loadTasks()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ task: "invalid" }));
    expect(loadTasks()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: "damaged" }]));
    expect(loadTasks()).toEqual([]);
  });
});
