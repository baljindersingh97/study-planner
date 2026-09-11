import { useEffect, useMemo, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { TaskFilterBar } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { loadTasks, saveTasks } from "./services/taskStorage";
import type { StudyTask, TaskDraft, TaskFilters } from "./types";
import { getSubjects, getVisibleTasks } from "./utils/tasks";
import "./styles.css";

const initialFilters: TaskFilters = {
  search: "",
  status: "all",
  subject: "all",
  sortBy: "due-date",
};

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
}

export default function App() {
  const [tasks, setTasks] = useState<StudyTask[]>(loadTasks);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks, filters),
    [tasks, filters],
  );
  const subjects = useMemo(() => getSubjects(tasks), [tasks]);

  function submitTask(draft: TaskDraft) {
    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask.id ? { ...task, ...draft } : task,
        ),
      );
      setEditingTask(null);
      return;
    }

    setTasks((current) => [
      ...current,
      {
        ...draft,
        id: createId(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(task: StudyTask) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setTasks((current) => current.filter((item) => item.id !== task.id));
    if (editingTask?.id === task.id) setEditingTask(null);
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.completed));
    if (editingTask?.completed) setEditingTask(null);
  }

  return (
    <>
      <header className="site-header">
        <div>
          <p className="eyebrow">Plan clearly. Study steadily.</p>
          <h1>Study Planner</h1>
          <p>Organise subjects, deadlines, priorities and study time.</p>
        </div>
      </header>

      <main>
        <Dashboard tasks={tasks} />
        <TaskForm
          editingTask={editingTask}
          onSubmit={submitTask}
          onCancel={() => setEditingTask(null)}
        />
        <TaskFilterBar
          filters={filters}
          subjects={subjects}
          hasCompleted={tasks.some((task) => task.completed)}
          onChange={setFilters}
          onClearCompleted={clearCompleted}
        />
        <section className="tasks-section" aria-labelledby="task-list-title">
          <div className="list-heading">
            <div>
              <p className="eyebrow">Your plan</p>
              <h2 id="task-list-title">Study tasks</h2>
            </div>
            <span>{visibleTasks.length} shown</span>
          </div>
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onEdit={setEditingTask}
            onDelete={deleteTask}
          />
        </section>
      </main>

      <footer>Study Planner stores your tasks in this browser.</footer>
    </>
  );
}
