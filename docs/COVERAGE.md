# Test Coverage and Reflection

Coverage date: 10 September 2026

Command used:

```bash
npm run test:coverage
```

## Overall result

| Measure    | Coverage |
| ---------- | -------: |
| Statements |   97.20% |
| Branches   |   94.91% |
| Functions  |   96.72% |
| Lines      |   98.31% |

The HTML report is available at `coverage/index.html`, and the machine-readable
summary is at `coverage/coverage-summary.json` after running the command.

## Area results

- Date, validation and task utility modules achieved 100% statement, branch,
  function and line coverage.
- The storage module achieved 100% line and function coverage, 94.44% branch
  coverage and 92.30% statement coverage.
- `Dashboard`, `TaskFilters` and `TaskList` achieved 100% in all measures.
- `App.tsx` achieved 100% line and function coverage, 97.29% statement coverage
  and 78.57% branch coverage.
- `TaskForm.tsx` achieved 92% statement coverage, 92.85% branch coverage, 81.81%
  function coverage and 90.47% line coverage.

## Reflection

The business rules are well tested because their pure functions cover valid,
invalid, boundary and state cases. Application integration tests also exercise
the main create, edit, delete, completion, filtering, dashboard and persistence
flows. Playwright adds three browser journeys but is not included in the V8
unit-coverage percentages.

The remaining gaps are mainly individual form event-handler paths and the
fallback ID path used only when a browser has no `crypto.randomUUID`. The due
date error is verified at the validation-function level rather than through a
separate rendered form test. These gaps are low risk because the corresponding
requirements are covered by automated tests at another level.

Future improvement would add browser coverage for invalid past dates, test more
combined search/status/subject filters, and run the E2E suite in Firefox and
WebKit. High coverage supports confidence but does not prove that every possible
user behaviour is correct.
