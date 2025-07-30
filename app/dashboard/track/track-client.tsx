// app/dashboard/track/track-client.tsx
"use client";

import { usePreloadedQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useDashboardData } from "../dashboard-context";
import { TrackProvider, useTrack, TaskWithTime } from "./track-context";
import TaskCard from "./task-card";
import { useState } from "react";

// helper
function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function TrackContent() {
  const { optimisticTasks, setOptimistic, createTask, startTrans, isPending } =
    useTrack();

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTopic, setNewTaskTopic] = useState("");

  const totalToday = optimisticTasks.reduce(
    (sum: number, t) => sum + (t.todayTime ?? 0),
    0,
  );

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    startTrans(() => {
      const tempTask: TaskWithTime = {
        _id: `temp-${Date.now()}` as Id<"tasks">,
        _creationTime: Date.now(),
        id: `temp-${Date.now()}`,
        title: newTaskTitle,
        topic: newTaskTopic || undefined,
        createdAt: Date.now(),
        userId: "temp" as Id<"users">,
        totalTime: 0,
        todayTime: 0,
      };

      setOptimistic({ type: "addTask", task: tempTask });

      createTask({ title: newTaskTitle, topic: newTaskTopic || undefined });

      setNewTaskTitle("");
      setNewTaskTopic("");
      setShowAddTask(false);
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      {/* Daily Summary Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <h2 className="text-2xl font-bold">{formatTime(totalToday)} TODAY</h2>
          <div className="text-muted-foreground text-right text-sm">
            {optimisticTasks
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
                disabled={!newTaskTitle.trim() || isPending}
              >
                Create Task
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
        {optimisticTasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No tasks yet. Create your first task to start tracking time.
            </CardContent>
          </Card>
        ) : (
          optimisticTasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}

export default function TrackClient() {
  const { preloadedTasks } = useDashboardData();

  if (!preloadedTasks)
    throw new Error("TrackClient rendered without preloadedTasks");

  const tasks = usePreloadedQuery(preloadedTasks) as TaskWithTime[];

  return (
    <TrackProvider initialTasks={tasks}>
      <TrackContent />
    </TrackProvider>
  );
}
