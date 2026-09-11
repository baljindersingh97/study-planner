import type { StudyTask } from "../types";
import { formatMinutes, getTaskStats } from "../utils/tasks";

interface DashboardProps {
  tasks: StudyTask[];
}

export function Dashboard({ tasks }: DashboardProps) {
  const stats = getTaskStats(tasks);

  return (
    <section className="dashboard" aria-label="Study summary">
      <div className="stat-card">
        <span>Total tasks</span>
        <strong>{stats.total}</strong>
      </div>
      <div className="stat-card">
        <span>Pending</span>
        <strong>{stats.pending}</strong>
      </div>
      <div className="stat-card">
        <span>Completed</span>
        <strong>{stats.completed}</strong>
      </div>
      <div className="stat-card">
        <span>Study time left</span>
        <strong>{formatMinutes(stats.remainingMinutes)}</strong>
      </div>
      <div className="progress-card">
        <div>
          <span>Overall progress</span>
          <strong>{stats.progress}%</strong>
        </div>
        <progress
          aria-label="Overall progress"
          max="100"
          value={stats.progress}
        />
      </div>
    </section>
  );
}
