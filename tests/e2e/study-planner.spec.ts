import { expect, test, type Page } from "@playwright/test";

function futureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function addTask(
  page: Page,
  title: string,
  subject: string,
  dueInDays: number,
  priority = "medium",
) {
  await page.getByLabel("Task title").fill(title);
  await page.getByLabel("Task subject").fill(subject);
  await page.getByLabel("Due date").fill(futureDate(dueInDays));
  await page.getByLabel("Priority").selectOption(priority);
  await page.getByRole("button", { name: "Add study task" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("E2E-01 manages a task through creation, editing and completion", async ({
  page,
}) => {
  await addTask(page, "Prepare testing notes", "Software Testing", 2, "high");
  await expect(page.getByText("Prepare testing notes")).toBeVisible();
  await expect(page.getByText("1 shown")).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Task title").fill("Prepare complete testing notes");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page
    .getByRole("button", {
      name: "Mark Prepare complete testing notes as completed",
    })
    .click();

  await expect(page.getByText("100%")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Prepare complete testing notes")).toBeVisible();
  await expect(
    page.getByRole("article").getByText("Completed", { exact: true }),
  ).toBeVisible();
});

test("E2E-02 searches, filters, sorts and removes tasks", async ({ page }) => {
  await addTask(page, "Zoology revision", "Biology", 3, "low");
  await addTask(page, "Algebra questions", "Mathematics", 1, "high");
  await addTask(page, "Biology flashcards", "Biology", 2, "medium");

  await page.getByLabel("Search").fill("biology");
  await expect(page.getByText("2 shown")).toBeVisible();
  await page.getByLabel("Search").clear();
  await page.getByLabel("Subject", { exact: true }).selectOption("Mathematics");
  await expect(page.getByText("Algebra questions")).toBeVisible();
  await expect(page.getByText("1 shown")).toBeVisible();

  await page.getByLabel("Subject", { exact: true }).selectOption("all");
  await page.getByLabel("Sort by").selectOption("title");
  const headings = page.locator(".task-card h3");
  await expect(headings.first()).toHaveText("Algebra questions");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).first().click();
  await expect(page.getByText("2 shown")).toBeVisible();
});

test("E2E-03 rejects invalid data and clears completed tasks", async ({
  page,
}) => {
  await page.getByLabel("Study time (minutes)").fill("14");
  await page.getByRole("button", { name: "Add study task" }).click();
  await expect(page.getByText("Enter a task title.")).toBeVisible();
  await expect(page.getByText("Enter a subject.")).toBeVisible();
  await expect(
    page.getByText("Study time must be between 15 and 480 minutes."),
  ).toBeVisible();

  await page.getByLabel("Study time (minutes)").fill("60");
  await addTask(page, "Complete mock exam", "Testing", 1);
  await page
    .getByRole("button", { name: "Mark Complete mock exam as completed" })
    .click();
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(page.getByText("No tasks found")).toBeVisible();
});
