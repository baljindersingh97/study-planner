# User Stories and Acceptance Criteria

## US-01: Create a study task

As a student, I want to create a study task so that I can record work I need
to complete.

- **AC-01.1:** A task with valid details is added to the task list and stored.
- **AC-01.2:** Leading and trailing spaces are removed from its title and
  subject.
- **AC-01.3:** A blank title or subject is rejected with a clear message.
- **AC-01.4:** A title longer than 80 characters or subject longer than 40
  characters is rejected.

## US-02: Estimate study time

As a student, I want to record an estimated duration so that I can understand
my remaining workload.

- **AC-02.1:** Whole-number durations from 15 to 480 minutes inclusive are
  accepted.
- **AC-02.2:** Durations below 15, above 480 or containing a fraction are
  rejected.

## US-03: Edit a task

As a student, I want to edit a task so that I can correct or update my plan.

- **AC-03.1:** Selecting Edit loads the task into the form and valid changes
  replace the saved details.
- **AC-03.2:** Cancelling editing keeps the previously saved task unchanged.

## US-04: Delete a task

As a student, I want to delete an unwanted task so that my plan stays current.

- **AC-04.1:** Confirming deletion removes the selected task.
- **AC-04.2:** Cancelling the confirmation keeps the task.

## US-05: Change completion status

As a student, I want to mark work completed or pending so that I can track my
progress accurately.

- **AC-05.1:** A pending task can be changed to completed.
- **AC-05.2:** A completed task can be reopened as pending.

## US-06: Search tasks

As a student, I want to search my tasks so that I can quickly find relevant
work.

- **AC-06.1:** A partial, case-insensitive title or subject search returns the
  matching tasks.
- **AC-06.2:** A search with no matches displays the empty-state message.

## US-07: Filter by status

As a student, I want to filter by status so that I can focus on pending or
completed work.

- **AC-07.1:** Pending displays only unfinished tasks.
- **AC-07.2:** Completed displays only finished tasks, and All restores both.

## US-08: Filter by subject

As a student, I want to filter by subject so that I can focus on one course.

- **AC-08.1:** Each unique subject is available once in the subject filter.
- **AC-08.2:** Selecting a subject displays only tasks for that subject.

## US-09: Sort tasks

As a student, I want to sort tasks so that I can view them in a useful order.

- **AC-09.1:** Due-date sorting places the earliest deadline first.
- **AC-09.2:** Priority sorting orders high, medium and then low priority.
- **AC-09.3:** Title sorting orders tasks alphabetically.

## US-10: Manage deadlines and priority

As a student, I want each task to have a deadline and priority so that urgent
work is easy to identify.

- **AC-10.1:** A user can assign low, medium or high priority and see it on the
  task.
- **AC-10.2:** Today's due date is accepted, but a new task with a past date is
  rejected.
- **AC-10.3:** An unfinished saved task past its due date is labelled Overdue;
  a completed task is not.

## US-11: View a progress dashboard

As a student, I want a summary of my plan so that I can see progress and
remaining workload.

- **AC-11.1:** The dashboard shows total, pending and completed task counts.
- **AC-11.2:** It shows the total minutes for pending tasks in a readable form.
- **AC-11.3:** It shows completed tasks as a rounded percentage of all tasks.

## US-12: Keep tasks between sessions

As a student, I want tasks saved locally so that my plan remains after I reload
the application.

- **AC-12.1:** Task changes are saved in browser local storage and restored on
  reload.
- **AC-12.2:** Missing or damaged stored data opens as an empty planner instead
  of crashing.

## US-13: Clear completed tasks

As a student, I want to remove all completed tasks so that I can tidy my plan.

- **AC-13.1:** Clear completed removes all completed tasks but keeps pending
  tasks.
- **AC-13.2:** The control is disabled when no completed tasks exist.
