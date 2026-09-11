# Architecture Overview

## Design

Study Planner is a single-page React application. It uses a component-based
interface, small utility modules for business rules and browser local storage
for persistence.

```text
Browser user
    |
    v
React App
    |-- Dashboard
    |-- TaskForm
    |-- TaskFilterBar
    `-- TaskList
          |
          v
Validation, date and task utilities
          |
          v
Local-storage service
          |
          v
Browser local storage
```

## Components

- `App.tsx` owns task state, filtering state and task actions.
- `TaskForm.tsx` captures task details and applies validation before submission.
- `TaskFilters.tsx` controls search, status, subject and sort selections.
- `TaskList.tsx` displays task details and action controls.
- `Dashboard.tsx` calculates and displays task counts, remaining time and
  completion progress.

## Supporting modules

- `validation.ts` contains the form business rules.
- `tasks.ts` filters, sorts and summarises tasks.
- `date.ts` provides date formatting and overdue logic.
- `taskStorage.ts` reads and writes JSON using browser local storage.
- `types.ts` contains the shared TypeScript data types.

## Data flow

The form passes a valid task draft to `App`. `App` creates or updates the task
state. React then updates the visible list and dashboard. A React effect saves
the latest task array to local storage. On the next load, the initial state is
restored from the same storage key.

Filters do not modify saved data. They create a derived visible list using
`getVisibleTasks`.

## Design decisions

- React separates the interface into small testable components.
- TypeScript finds type errors before the application runs.
- Local storage keeps the project small and reproducible without a server.
- Pure utility functions make validation, filtering and calculations easy to
  unit test.
- Accessible labels allow keyboard and automated browser interaction.
- Responsive CSS supports desktop and small-screen layouts.

## Limitation

Local storage is suitable for this small project, but it does not support user
accounts, device synchronisation or recovery after browser data is cleared.
