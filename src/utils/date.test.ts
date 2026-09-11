import { formatDate, isOverdue, todayIso } from "./date";
import { tasks } from "../test/fixtures";

describe("date helpers", () => {
  test("UT-10 identifies only unfinished past tasks as overdue", () => {
    expect(
      isOverdue({ ...tasks[0], dueDate: "2029-05-01" }, "2029-05-02"),
    ).toBe(true);
    expect(
      isOverdue(
        { ...tasks[0], dueDate: "2029-05-01", completed: true },
        "2029-05-02",
      ),
    ).toBe(false);
    expect(
      isOverdue({ ...tasks[0], dueDate: "2029-05-02" }, "2029-05-02"),
    ).toBe(false);
  });

  test("UT-11 formats dates and creates a local ISO date", () => {
    expect(formatDate("2030-06-10")).toBe("10 Jun 2030");
    expect(todayIso(new Date("2030-06-10T12:00:00"))).toBe("2030-06-10");
  });
});
