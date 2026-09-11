import type { TaskDraft } from "../types";
import { validateTask } from "./validation";

const validDraft: TaskDraft = {
  title: "Revise chapter 3",
  subject: "Mathematics",
  dueDate: "2030-06-10",
  priority: "high",
  estimatedMinutes: 60,
};

describe("task validation", () => {
  test("UT-01 accepts a valid task", () => {
    expect(validateTask(validDraft, "2030-06-01")).toEqual({});
  });

  test("UT-02 rejects missing and overlong task details", () => {
    expect(
      validateTask(
        {
          ...validDraft,
          title: " ",
          subject: " ",
          dueDate: "",
        },
        "2030-06-01",
      ),
    ).toMatchObject({
      title: "Enter a task title.",
      subject: "Enter a subject.",
      dueDate: "Choose a due date.",
    });

    expect(
      validateTask(
        {
          ...validDraft,
          title: "a".repeat(81),
          subject: "b".repeat(41),
        },
        "2030-06-01",
      ),
    ).toMatchObject({
      title: "Title must be 80 characters or fewer.",
      subject: "Subject must be 40 characters or fewer.",
    });
  });

  test("UT-03 applies the study-time boundaries", () => {
    expect(
      validateTask({ ...validDraft, estimatedMinutes: 15 }, "2030-06-01"),
    ).toEqual({});
    expect(
      validateTask({ ...validDraft, estimatedMinutes: 480 }, "2030-06-01"),
    ).toEqual({});
    expect(
      validateTask({ ...validDraft, estimatedMinutes: 14 }, "2030-06-01"),
    ).toHaveProperty("estimatedMinutes");
    expect(
      validateTask({ ...validDraft, estimatedMinutes: 481 }, "2030-06-01"),
    ).toHaveProperty("estimatedMinutes");
    expect(
      validateTask({ ...validDraft, estimatedMinutes: 60.5 }, "2030-06-01"),
    ).toHaveProperty("estimatedMinutes", "Study time must be a whole number.");
  });

  test("UT-04 accepts today and rejects a past due date", () => {
    expect(
      validateTask({ ...validDraft, dueDate: "2030-06-01" }, "2030-06-01"),
    ).toEqual({});
    expect(
      validateTask({ ...validDraft, dueDate: "2030-05-31" }, "2030-06-01"),
    ).toHaveProperty("dueDate", "Due date cannot be in the past.");
  });
});
