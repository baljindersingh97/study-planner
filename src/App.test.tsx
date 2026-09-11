import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { STORAGE_KEY } from "./services/taskStorage";
import { tasks } from "./test/fixtures";

function seedTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

async function addTask(title = "Review lecture notes", subject = "Computing") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Task title"), title);
  await user.type(screen.getByLabelText("Task subject"), subject);
  await user.click(screen.getByRole("button", { name: "Add study task" }));
  return user;
}

describe("Study Planner integration", () => {
  test("IT-01 adds a valid task and trims its text", async () => {
    render(<App />);
    await addTask("  Review lecture notes  ", "  Computing  ");

    expect(screen.getByText("Review lecture notes")).toBeInTheDocument();
    expect(
      within(screen.getByRole("article")).getByText("Computing"),
    ).toBeInTheDocument();
    expect(screen.getByText("1 shown")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"),
      ).toHaveLength(1),
    );
  });

  test("IT-02 shows validation errors and does not create an invalid task", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText("Study time (minutes)"));
    await user.type(screen.getByLabelText("Study time (minutes)"), "14");
    await user.click(screen.getByRole("button", { name: "Add study task" }));

    expect(screen.getByText("Enter a task title.")).toBeInTheDocument();
    expect(screen.getByText("Enter a subject.")).toBeInTheDocument();
    expect(
      screen.getByText("Study time must be between 15 and 480 minutes."),
    ).toBeInTheDocument();
    expect(screen.getByText("0 shown")).toBeInTheDocument();
  });

  test("IT-03 edits a task and supports cancelling an edit", async () => {
    seedTasks();
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    const title = screen.getByLabelText("Task title");
    await user.clear(title);
    await user.type(title, "Updated biology notes");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByText("Updated biology notes")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    await user.clear(screen.getByLabelText("Task title"));
    await user.type(screen.getByLabelText("Task title"), "Discarded change");
    await user.click(screen.getByRole("button", { name: "Cancel editing" }));
    expect(screen.queryByText("Discarded change")).not.toBeInTheDocument();
  });

  test("IT-04 deletes only after confirmation", async () => {
    seedTasks();
    render(<App />);
    const user = userEvent.setup();
    const confirmation = vi
      .spyOn(window, "confirm")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(screen.getByText("Prepare biology notes")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(screen.queryByText("Prepare biology notes")).not.toBeInTheDocument();
    expect(confirmation).toHaveBeenCalledTimes(2);
  });

  test("IT-05 completes and reopens a task while updating the dashboard", async () => {
    seedTasks();
    render(<App />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "Mark Read algebra chapter as completed",
      }),
    );
    expect(
      screen.getByRole("button", {
        name: "Mark Read algebra chapter as pending",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Mark Read algebra chapter as pending",
      }),
    );
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  test("IT-06 searches and filters by status", async () => {
    seedTasks();
    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Search"), "history");
    expect(screen.getByText("Draft history essay")).toBeInTheDocument();
    expect(screen.queryByText("Read algebra chapter")).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText("Search"));
    await user.type(screen.getByLabelText("Search"), "no matching task");
    expect(screen.getByText("No tasks found")).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Search"));
    await user.selectOptions(screen.getByLabelText("Status"), "completed");
    expect(screen.getByText("Prepare biology notes")).toBeInTheDocument();
    expect(screen.queryByText("Draft history essay")).not.toBeInTheDocument();
  });

  test("IT-07 filters by subject and sorts by title", async () => {
    seedTasks();
    render(<App />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Subject"), "Mathematics");
    expect(screen.getByText("Read algebra chapter")).toBeInTheDocument();
    expect(screen.queryByText("Prepare biology notes")).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Subject"), "all");
    await user.selectOptions(screen.getByLabelText("Sort by"), "title");
    expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
      "Draft history essay",
    );
  });

  test("IT-08 clears all completed tasks", async () => {
    seedTasks();
    render(<App />);
    const user = userEvent.setup();

    const completedCard = screen
      .getByText("Prepare biology notes")
      .closest("article");
    await user.click(
      within(completedCard as HTMLElement).getByRole("button", {
        name: "Edit",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Clear completed" }));
    expect(screen.queryByText("Prepare biology notes")).not.toBeInTheDocument();
    expect(screen.getByText("2 shown")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add a study task" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear completed" }),
    ).toBeDisabled();
  });

  test("IT-09 restores saved tasks after the app is remounted", async () => {
    const firstRender = render(<App />);
    await addTask("Persistent task", "Testing");
    await waitFor(() =>
      expect(localStorage.getItem(STORAGE_KEY)).toContain("Persistent task"),
    );
    firstRender.unmount();

    render(<App />);
    expect(screen.getByText("Persistent task")).toBeInTheDocument();
  });

  test("IT-10 displays overdue state and task details", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          ...tasks[0],
          dueDate: "2020-01-01",
          priority: "high",
          estimatedMinutes: 75,
        },
      ]),
    );
    render(<App />);

    const card = screen.getByRole("article");
    expect(within(card).getByText("Overdue")).toBeInTheDocument();
    expect(within(card).getByText("high")).toBeInTheDocument();
    expect(within(card).getByText("1h 15m")).toBeInTheDocument();
  });
});
