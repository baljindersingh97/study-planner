# Defect Log

## BUG-01: Ambiguous Subject control

- **Summary:** Automated user interaction could not distinguish the task
  subject field from the subject filter because both were labelled Subject.
- **Steps to reproduce:** Render the application and query the control with the
  accessible label `Subject`.
- **Expected:** The intended control is identified uniquely.
- **Actual:** Two controls match and the interaction fails.
- **Severity:** Medium
- **Status:** Resolved
- **Fix implemented:** Renamed the form label to `Task subject` while retaining
  `Subject` for the filter.
- **Retest:** IT-01, IT-07 and IT-09 pass after the change.

## BUG-02: Unit runner collected E2E tests

- **Summary:** Vitest attempted to run the Playwright specification as a unit
  test file.
- **Steps to reproduce:** Run `npm test` with the initial default Vitest file
  discovery configuration.
- **Expected:** Vitest runs only unit and integration files under `src`.
- **Actual:** The Playwright file was collected by the wrong runner and caused a
  suite error.
- **Severity:** High
- **Status:** Resolved
- **Fix implemented:** Set Vitest `include` to `src/**/*.test.{ts,tsx}`. The E2E
  directory remains controlled by Playwright.
- **Retest:** `npm test` runs five files and all 23 tests pass.

## BUG-03: Test assertion matched subject twice

- **Summary:** A subject value appeared both in the filter option and the task
  card, making a broad text assertion ambiguous.
- **Steps to reproduce:** Add a Computing task and search the whole page for the
  exact text `Computing`.
- **Expected:** The assertion verifies the task-card subject.
- **Actual:** Both the task card and filter option match.
- **Severity:** Low
- **Status:** Resolved
- **Fix implemented:** Scoped the assertion to the task article using
  Testing Library's `within` query.
- **Retest:** IT-01 passes and still verifies the visible card content.

## BUG-04: Inconsistent source formatting

- **Summary:** Prettier found inconsistent formatting in five source and test
  files.
- **Steps to reproduce:** Run `npm run format:check` before applying formatting.
- **Expected:** All checked files match the shared Prettier rules.
- **Actual:** Five files produced formatting warnings.
- **Severity:** Low
- **Status:** Resolved
- **Fix implemented:** Ran `npm run format` and retained the shared
  `.prettierrc` configuration.
- **Retest:** The final `npm run format:check` reports that all files are
  correctly formatted.

## BUG-05: E2E cleanup removed data after reload

- **Summary:** The initial Playwright setup registered local-storage cleanup for
  every new page document, so the persistence journey lost its task on reload.
- **Steps to reproduce:** Create a task in E2E-01 and reload the browser page.
- **Expected:** The saved task remains visible.
- **Actual:** Test setup clears the task before the reloaded page starts.
- **Severity:** High
- **Status:** Resolved
- **Fix implemented:** Clear storage once during test setup, then reload before
  the test starts instead of registering a script for all later navigations.
- **Retest:** E2E-01 passes and confirms real reload persistence.

## BUG-06: E2E locators matched multiple controls

- **Summary:** Playwright found multiple matches for the subject label and the
  word Completed in the interface.
- **Steps to reproduce:** Select the control labelled `Subject`, or query the
  whole page for the exact text `Completed` after completing a task.
- **Expected:** The intended filter or task status is used.
- **Actual:** Strict mode reports multiple possible elements.
- **Severity:** Low
- **Status:** Resolved
- **Fix implemented:** Use exact label matching for the filter and scope the
  status check to the task article.
- **Retest:** E2E-02 passes after the locator change.

## BUG-07: Production type check lacked test and Node types

- **Summary:** The first production build reported missing Vitest global names
  and Node type definitions. The original typecheck script also did not follow
  the referenced TypeScript projects.
- **Steps to reproduce:** Run the initial `npm run build` or
  `npm run typecheck` configuration.
- **Expected:** Application, test and tool configuration types are all checked.
- **Actual:** The build reports missing `test`, `expect`, `vi` and Node types.
- **Severity:** High
- **Status:** Resolved
- **Fix implemented:** Added `vitest/globals`, installed `@types/node`, and
  changed the typecheck command to TypeScript build mode.
- **Retest:** The final type check and production build finish successfully.

## BUG-08: Damaged task array could crash rendering

- **Summary:** Storage validation accepted any JSON array, including objects
  without the fields required by a study task.
- **Steps to reproduce:** Put `[{"id":"damaged"}]` in the local-storage task
  key and open the application.
- **Expected:** Damaged storage opens as an empty planner.
- **Actual:** Task filtering tries to read missing text fields and can throw an
  error.
- **Severity:** High
- **Status:** Resolved
- **Fix implemented:** Added a task shape check before returning saved data.
- **Retest:** UT-13 passes for malformed JSON, non-array data and a damaged task
  array.

## BUG-09: Clearing the task being edited left a stale form

- **Summary:** Clear completed removed a completed task from the list but left
  that task in the edit form.
- **Steps to reproduce:** Edit a completed task and select Clear completed.
- **Expected:** The removed task disappears and the form returns to Add mode.
- **Actual:** The form still displays the removed task in Edit mode.
- **Severity:** Medium
- **Status:** Resolved
- **Fix implemented:** Clear the editing state when the edited task is
  completed.
- **Retest:** IT-08 now verifies removal, pending-task retention, disabled clear
  control and return to Add mode.
