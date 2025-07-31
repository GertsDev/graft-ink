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
        <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      {/* Daily Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <h2 className="text-2xl font-bold">{formatTime(totalToday)} TODAY</h2>
          <div className="text-muted-foreground text-right text-sm">
            {tasks
              .filter((t) => (t.todayTime ?? 0) > 0)
              .slice(0, 2)
              .map((t) => (
                <p key={t._id}>
                  {t.title}: {formatTime(t.todayTime ?? 0)}
                </p>
              ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary flex h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${Math.min(100, (totalToday / 180) * 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Task Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAddTask(true)}
          className="bg-primary"
          disabled={showAddTask}
        >
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <Card>
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
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                autoFocus
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Topic (optional)"
                value={newTaskTopic}
                onChange={(e) => setNewTaskTopic(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateTask}
                disabled={!newTaskTitle.trim() || isCreating}
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
          <Card>
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
