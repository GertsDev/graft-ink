"use client";

import { useState, useEffect } from "react";
import { useDashboardData } from "../../../shared/features/dashboard/_hooks/use-dashboard-data";
import { useTaskOperations } from "../../../shared/features/dashboard/_hooks/use-task-operations";
import { DailySummary } from "../../../shared/features/dashboard/track/daily-summary";
import { AddTaskButton } from "../../../shared/features/dashboard/track/add-task-button";
import { AddTaskForm } from "../../../shared/features/dashboard/track/add-task-form";
import { TasksGrid } from "../../../shared/features/dashboard/track/tasks-grid";
import { LoadingSkeleton } from "../../../shared/features/dashboard/track/loading-skeleton";

export default function TrackPage() {
  const { tasks, totalToday, isLoading } = useDashboardData();

  const { createTask } = useTaskOperations();
  const [showAddTask, setShowAddTask] = useState(false);

  const handleCreateTask = async (title: string, topic?: string) => {
    await createTask(title, topic);
    setShowAddTask(false);
  };

  const handleCancelTask = () => {
    setShowAddTask(false);
  };

  // Global shortcut for Alt+T to open add task form
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey &&
        e.code === "KeyT"
      ) {
        e.preventDefault();
        if (!showAddTask) {
          setShowAddTask(true);
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showAddTask]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      <DailySummary totalToday={totalToday} tasks={tasks} />

      <AddTaskButton
        onAddTask={() => setShowAddTask(true)}
        disabled={showAddTask}
      />

      {showAddTask && (
        <AddTaskForm
          onCreateTask={handleCreateTask}
          onCancel={handleCancelTask}
        />
      )}

      <TasksGrid tasks={tasks} />
    </div>
  );
}
