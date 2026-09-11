# Test Cases and Traceability

## Automated test cases

| Test ID | Method               | Purpose                                             | Expected result                                              |
| ------- | -------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| UT-01   | Unit                 | Validate a normal task                              | No validation errors                                         |
| UT-02   | Unit                 | Check blank and overlong text partitions            | Clear errors for each invalid field                          |
| UT-03   | Unit/BVA             | Check 14, 15, 480, 481 and fractional minutes       | Only whole values from 15 to 480 pass                        |
| UT-04   | Unit/BVA             | Check yesterday and today's date                    | Today passes and yesterday fails                             |
| UT-05   | Unit/EP              | Search by title, subject, case and no match         | Only matching tasks are returned; no match returns empty     |
| UT-06   | Unit/EP              | Filter pending and completed tasks                  | Only tasks in the selected state are returned                |
| UT-07   | Unit                 | Filter and list unique subjects                     | Correct task and sorted unique subjects are returned         |
| UT-08   | Unit                 | Sort by date, priority and title                    | Correct order is returned for each option                    |
| UT-09   | Unit                 | Calculate totals, progress and formatted duration   | Counts, pending minutes, percentage and text are correct     |
| UT-10   | Unit/State           | Check overdue status for pending/completed tasks    | Only an unfinished past task is overdue                      |
| UT-11   | Unit                 | Format a date and create local ISO date             | Expected display and ISO strings are returned                |
| UT-12   | Unit                 | Save and reload a task array                        | Reloaded data equals saved data                              |
| UT-13   | Unit/EP              | Load missing, malformed, non-array or damaged tasks | An empty array is returned without crashing                  |
| IT-01   | Integration          | Submit a valid task through the form                | Trimmed task appears and is stored                           |
| IT-02   | Integration/EP       | Submit blank details and 14 minutes                 | Errors appear and no task is added                           |
| IT-03   | Integration/State    | Save and cancel edits                               | Saved edit appears; cancelled edit is discarded              |
| IT-04   | Integration/Decision | Cancel and confirm deletion                         | Cancellation keeps task; confirmation removes it             |
| IT-05   | Integration/State    | Complete and reopen a task                          | Status and dashboard percentage update both ways             |
| IT-06   | Integration          | Search and filter by status                         | Correct cards or empty state are displayed                   |
| IT-07   | Integration          | Filter by subject and sort by title                 | Only the subject appears; all tasks then sort alphabetically |
| IT-08   | Integration          | Clear completed tasks, including one being edited   | Completed tasks are removed and the form returns to Add mode |
| IT-09   | Integration          | Remount the application                             | A newly saved task is restored                               |
| IT-10   | Integration          | Display past date, priority and duration            | Overdue, high priority and 1h 15m are displayed              |
| E2E-01  | End-to-end           | Create, edit, complete and reload a task            | Updated completed task and 100% progress survive reload      |
| E2E-02  | End-to-end           | Search, filter, sort and delete three tasks         | Each control changes the browser UI and deletion succeeds    |
| E2E-03  | End-to-end           | Reject invalid input and clear a completed task     | Errors appear, then the completed task can be cleared        |

The automated implementation is in the `*.test.ts`, `*.test.tsx` and
`tests/e2e/study-planner.spec.ts` files. The ID at the start of every test name
connects its code to this table.

## Acceptance-criteria traceability

| Acceptance criterion | Automated test coverage |
| -------------------- | ----------------------- |
| AC-01.1              | UT-01, IT-01, E2E-01    |
| AC-01.2              | IT-01                   |
| AC-01.3              | UT-02, IT-02, E2E-03    |
| AC-01.4              | UT-02                   |
| AC-02.1              | UT-03, IT-01            |
| AC-02.2              | UT-03, IT-02, E2E-03    |
| AC-03.1              | IT-03, E2E-01           |
| AC-03.2              | IT-03                   |
| AC-04.1              | IT-04, E2E-02           |
| AC-04.2              | IT-04                   |
| AC-05.1              | IT-05, E2E-01           |
| AC-05.2              | IT-05                   |
| AC-06.1              | UT-05, IT-06, E2E-02    |
| AC-06.2              | UT-05, IT-06            |
| AC-07.1              | UT-06                   |
| AC-07.2              | UT-06, IT-06            |
| AC-08.1              | UT-07                   |
| AC-08.2              | UT-07, IT-07, E2E-02    |
| AC-09.1              | UT-08                   |
| AC-09.2              | UT-08                   |
| AC-09.3              | UT-08, IT-07, E2E-02    |
| AC-10.1              | UT-01, IT-10, E2E-01    |
| AC-10.2              | UT-04                   |
| AC-10.3              | UT-10, IT-10            |
| AC-11.1              | UT-09, IT-05, E2E-01    |
| AC-11.2              | UT-09                   |
| AC-11.3              | UT-09, IT-05, E2E-01    |
| AC-12.1              | UT-12, IT-09, E2E-01    |
| AC-12.2              | UT-13                   |
| AC-13.1              | IT-08, E2E-03           |
| AC-13.2              | IT-08                   |
