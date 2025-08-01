"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useDashboardData } from "../shared/hooks/use-dashboard-data";
import { useTaskOperations } from "../shared/hooks/use-task-operations";

import TaskCard from "../shared/components/task-card";

// Helper function
function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export default function TrackPage() {
  const { tasks, totalToday, isLoading } = useDashboardData();
  const { createTask } = useTaskOperations();

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTask(newTaskTitle.trim(), newTaskTopic.trim() || undefined);
      setNewTaskTitle("");
      setNewTaskTopic("");
      setShowAddTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        {/* Daily Summary Skeleton */}
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-muted h-8 w-32 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-2 w-full animate-pulse rounded" />
          </CardContent>
        </Card>

        {/* Add Task Button Skeleton */}
        <div className="flex justify-end">
          <div className="bg-muted h-10 w-24 animate-pulse rounded" />
        </div>

        {/* Tasks Grid Skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-muted h-32 animate-pulse rounded-lg" />
          <div className="bg-muted h-32 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      {/* Daily Summary Card */}
      <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <h2 className="text-2xl font-bold transition-all duration-300">
            <span className="font-mono">{formatTime(totalToday)}</span> TODAY
          </h2>
          <div className="text-muted-foreground animate-in fade-in-0 text-right text-sm delay-100 duration-300">
            {tasks
              .filter((t) => (t.todayTime ?? 0) > 0)
              .slice(0, 2)
              .map((t) => (
                <p key={t._id} className="transition-all duration-200">
                  {t.title}:{" "}
                  <span className="font-mono">
                    {formatTime(t.todayTime ?? 0)}
                  </span>
                </p>
              ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary flex h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full bg-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, (totalToday / 180) * 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Task Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAddTask(true)}
          className="bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-95"
          disabled={showAddTask}
        >
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <CardHeader>
            <h3 className="text-lg font-semibold">Create New Task</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="focus:ring-ring/20 focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-200 focus:ring-2"
                autoFocus
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Topic (optional)"
                value={newTaskTopic}
                onChange={(e) => setNewTaskTopic(e.target.value)}
                className="focus:ring-ring/20 focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-200 focus:ring-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateTask}
                disabled={!newTaskTitle.trim() || isCreating}
                className="transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                {isCreating ? "Creating..." : "Create Task"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskTitle("");
                  setNewTaskTopic("");
                }}
                className="transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tasks.length === 0 ? (
          <Card className="animate-in fade-in-0 duration-300">
            <CardContent className="p-6 text-center text-gray-500">
              No tasks yet. Create your first task to start tracking time.
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}
