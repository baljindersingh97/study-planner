import type { SortOption, StatusFilter, TaskFilters } from "../types";

interface TaskFiltersProps {
  filters: TaskFilters;
  subjects: string[];
  hasCompleted: boolean;
  onChange: (filters: TaskFilters) => void;
  onClearCompleted: () => void;
}

export function TaskFilterBar({
  filters,
  subjects,
  hasCompleted,
  onChange,
  onClearCompleted,
}: TaskFiltersProps) {
  return (
    <section className="panel filters" aria-label="Task filters">
      <div className="field search-field">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Search tasks or subjects"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </div>

      <div className="field">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as StatusFilter,
            })
          }
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="subject-filter">Subject</label>
        <select
          id="subject-filter"
          value={filters.subject}
          onChange={(event) =>
            onChange({ ...filters, subject: event.target.value })
          }
        >
          <option value="all">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          value={filters.sortBy}
          onChange={(event) =>
            onChange({
              ...filters,
              sortBy: event.target.value as SortOption,
            })
          }
        >
          <option value="due-date">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <button
        type="button"
        className="danger clear-button"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </section>
  );
}
