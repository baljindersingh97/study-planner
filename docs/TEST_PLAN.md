# Test Plan

## 1. Test objectives

- Confirm that all acceptance criteria in `USER_STORIES.md` are implemented.
- Check that task creation, modification, completion and deletion behave
  correctly.
- Check validation at normal, invalid and boundary values.
- Confirm that search, filtering and sorting return the correct tasks.
- Confirm that dashboard calculations and local persistence are accurate.
- Detect code-quality, type and formatting problems before release.

## 2. Scope

### In scope

- All 13 user stories and their acceptance criteria.
- Validation and utility functions.
- Integration between forms, state, components and local storage.
- Complete browser journeys in Chromium.
- Responsive interface structure at desktop and mobile widths.
- TypeScript, ESLint and Prettier static checks.

### Out of scope

- User accounts and remote databases.
- Synchronisation between devices.
- Server security and performance testing because the project has no server.
- Browsers other than Chromium for the submitted E2E suite.

## 3. Test levels

### Unit testing

Vitest tests validation, date handling, filtering, sorting, statistics and the
storage service in isolation.

### Integration testing

React Testing Library renders the complete application in jsdom. Tests interact
with the form and controls as a user would and check updates across components
and storage.

### End-to-end testing

Playwright starts the Vite application and uses Chromium to test complete user
journeys, including browser reload and confirmation dialogs.

## 4. Test techniques

### Equivalence partitioning

Inputs are divided into valid and invalid groups. Examples include blank and
non-blank task details, matching and non-matching searches, and valid and
invalid stored JSON.

### Boundary-value analysis

The main boundaries are:

| Field          | Values checked              |
| -------------- | --------------------------- |
| Title length   | 0, 80 and 81 characters     |
| Subject length | 0, 40 and 41 characters     |
| Study time     | 14, 15, 480 and 481 minutes |
| Due date       | Yesterday and today         |

### State-transition testing

Completion is tested through Pending → Completed → Pending. Editing is tested
through View → Edit → Save and View → Edit → Cancel.

### Decision-table testing

Search, status and subject conditions are combined in `getVisibleTasks`. A task
is displayed only when all active conditions match.

| Search matches | Status matches | Subject matches | Display task |
| -------------- | -------------- | --------------- | ------------ |
| Yes            | Yes            | Yes             | Yes          |
| No             | Yes            | Yes             | No           |
| Yes            | No             | Yes             | No           |
| Yes            | Yes            | No              | No           |

### Use-case testing

The E2E suite covers realistic workflows: creating, editing, completing,
reloading, finding and deleting tasks.

## 5. Tools and frameworks

| Tool                  | Use                                |
| --------------------- | ---------------------------------- |
| Vitest                | Unit and integration test runner   |
| React Testing Library | User-focused component interaction |
| Playwright            | Chromium E2E testing               |
| V8 coverage           | Line, branch and function coverage |
| TypeScript compiler   | Static type checking               |
| ESLint                | Static code analysis               |
| Prettier              | Consistent code formatting         |

## 6. Test environment

- Windows development machine
- Node.js 24.18.0
- npm 11.16.0
- jsdom for integration tests
- Playwright Chromium for E2E tests
- Test data held in fixtures or created during a test

Each automated test clears or controls local storage to avoid depending on
another test.

## 7. Entry criteria

- User stories and acceptance criteria are approved for implementation.
- Project dependencies install successfully.
- The application builds and starts locally.
- Required test configuration and test data are available.

## 8. Exit criteria

- Every acceptance criterion maps to at least one automated test.
- All unit, integration and E2E tests pass.
- TypeScript and ESLint finish with no errors.
- Prettier reports no formatting problems.
- Line, branch and function coverage are generated and reviewed.
- No open critical or high-severity defects remain.
- Resolved defects have been retested.

## 9. Risks and controls

| Risk                                              | Control                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| Date tests vary by execution day                  | Use fixed future dates in unit data and calculate E2E dates dynamically |
| Saved data affects later tests                    | Clear local storage before tests                                        |
| Browser confirmation blocks automation            | Register Playwright dialog handling before deletion                     |
| High coverage hides missing behaviour             | Trace every acceptance criterion to a test                              |
| One-browser E2E scope misses compatibility faults | Record Chromium-only testing as a limitation                            |
