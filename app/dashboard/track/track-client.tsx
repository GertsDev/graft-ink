// app/dashboard/track/track-client.tsx
"use client";

import { useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useOptimistic, useTransition, useState, useEffect } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PenLine, Trash2, Check } from "lucide-react";
import { useDashboardData } from "../dashboard-context";

interface TaskWithTime {
  _id: Id<"tasks">;
  _creationTime: number;
  id: string;
  title: string;
  topic?: string;
  subtopic?: string;
  createdAt: number;
  userId: Id<"users">;
  totalTime?: number;
  todayTime?: number;
}

export default function TrackClient() {
  const { preloadedTasks } = useDashboardData();

  if (!preloadedTasks) {
    // This component should only be rendered when data is available.
    throw new Error("TrackClient rendered without preloadedTasks");
  }

  const tasks = usePreloadedQuery(preloadedTasks) as TaskWithTime[];

  const addTime = useMutation(api.timeEntries.add);
  const createTask = useMutation(api.tasks.createTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (
      current: TaskWithTime[],
      action:
        | { type: "addTime"; taskId: string; duration: number }
        | { type: "addTask"; task: TaskWithTime }
        | { type: "deleteTask"; taskId: Id<"tasks"> }
        | {
            type: "updateTask";
            taskId: Id<"tasks">;
            title: string;
            topic?: string | undefined;
          },
    ) => {
      switch (action.type) {
        case "addTime":
          return current.map((t: TaskWithTime) =>
            t._id === action.taskId
              ? { ...t, todayTime: (t.todayTime ?? 0) + action.duration }
              : t,
          );
        case "addTask":
          return [...current, action.task];
        case "deleteTask":
          return current.filter((t: TaskWithTime) => t._id !== action.taskId);
        case "updateTask":
          return current.map((t: TaskWithTime) =>
            t._id === action.taskId
              ? { ...t, title: action.title, topic: action.topic }
              : t,
          );
        default:
          return current;
      }
    },
  );

  const [isPending, startTransition] = useTransition();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [timeDurations, setTimeDurations] = useState<number[]>(() => {
    if (typeof window === "undefined") return [15, 30, 45];
    try {
      const stored = window.localStorage.getItem("timeDurations");
      if (stored) {
        const parsed = JSON.parse(stored) as number[];
        if (
          Array.isArray(parsed) &&
          parsed.every((n) => typeof n === "number" && n > 0)
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [15, 30, 45];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "timeDurations",
        JSON.stringify(timeDurations),
      );
    }
  }, [timeDurations]);
  const [tempDurations, setTempDurations] = useState<string[]>([]);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempTopic, setTempTopic] = useState<string>("");
  const [openEditTaskId, setOpenEditTaskId] = useState<Id<"tasks"> | null>(
    null,
  );

  const totalToday = optimisticTasks.reduce(
    (sum: number, t: TaskWithTime) => sum + (t.todayTime ?? 0),
    0,
  );

  const handleAddTime = (taskId: Id<"tasks">, duration: number) => {
    startTransition(() => {
      setOptimisticTasks({ type: "addTime", taskId: taskId, duration });
      addTime({ taskId, duration });
    });
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    startTransition(async () => {
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

      setOptimisticTasks({ type: "addTask", task: tempTask });

      try {
        await createTask({
          title: newTaskTitle,
          topic: newTaskTopic || undefined,
        });
        setNewTaskTitle("");
        setNewTaskTopic("");
        setShowAddTask(false);
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    });
  };

  const handleDeleteTask = (taskId: Id<"tasks">) => {
    startTransition(() => {
      setOptimisticTasks({ type: "deleteTask", taskId });
      deleteTask({ taskId });
      setOpenEditTaskId(null);
    });
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  const timeButtons = timeDurations.map((d) => ({
    label: `${d}m`,
    duration: d,
  }));

  const handleTempDurationChange = (index: number, value: string) => {
    // Keep only digits to ensure numeric input but allow empty string for editing
    const sanitized = value.replace(/[^0-9]/g, "");
    setTempDurations((prev) =>
      prev.map((d, i) => (i === index ? sanitized : d)),
    );
  };

  const applyDurations = () => {
    const nums = tempDurations.map((d) => parseInt(d, 10));
    if (nums.some((n) => isNaN(n) || n < 1)) {
      return; // Should be disabled already, just a safeguard
    }
    setTimeDurations(nums);
    setOpenEditTaskId(null);
  };

  const isTempDurationsValid = tempDurations.every((d) => {
    const n = parseInt(d, 10);
    return !isNaN(n) && n > 0;
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      {/* Daily Summary Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <h2 className="text-2xl font-bold">{formatTime(totalToday)} TODAY</h2>
          <div className="text-muted-foreground text-right text-sm">
            {optimisticTasks
              .filter((t: TaskWithTime) => (t.todayTime ?? 0) > 0)
              .slice(0, 2)
              .map((t: TaskWithTime) => (
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
          optimisticTasks.map((task: TaskWithTime) => (
            <Card key={task._id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    {openEditTaskId === task._id ? (
                      <>
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-base font-semibold"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={tempTopic}
                          onChange={(e) => setTempTopic(e.target.value)}
                          className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                          placeholder="Topic (optional)"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold">{task.title}</h3>
                        {task.topic && (
                          <p className="text-sm text-gray-500">{task.topic}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {openEditTaskId === task._id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete task"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Apply changes"
                          onClick={() => {
                            if (!isTempDurationsValid || !tempTitle.trim())
                              return;
                            if (openEditTaskId) {
                              startTransition(() => {
                                setOptimisticTasks({
                                  type: "updateTask",
                                  taskId: openEditTaskId,
                                  title: tempTitle.trim(),
                                  topic: tempTopic.trim() || undefined,
                                });
                                updateTask({
                                  taskId: openEditTaskId,
                                  title: tempTitle.trim(),
                                  topic: tempTopic.trim() || undefined,
                                });
                              });
                            }
                            applyDurations();
                          }}
                          disabled={!isTempDurationsValid || !tempTitle.trim()}
                          title={
                            isTempDurationsValid && tempTitle.trim()
                              ? "Apply changes"
                              : "Complete all fields correctly"
                          }
                        >
                          <Check
                            className={
                              "h-4 w-4 " +
                              (isTempDurationsValid && tempTitle.trim()
                                ? "text-green-600"
                                : "text-gray-400")
                            }
                          />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit task"
                        onClick={() => {
                          setTempDurations(timeDurations.map(String));
                          setTempTitle(task.title);
                          setTempTopic(task.topic ?? "");
                          setOpenEditTaskId(task._id);
                        }}
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {openEditTaskId === task._id
                      ? tempDurations.map((dur, idx) => (
                          <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={dur}
                            onChange={(e) =>
                              handleTempDurationChange(
                                idx,
                                e.currentTarget.value,
                              )
                            }
                            className="w-16 appearance-none rounded-md border px-2 py-1 text-center"
                          />
                        ))
                      : timeButtons.map((btn) => (
                          <Button
                            key={btn.label}
                            size="sm"
                            onClick={() =>
                              handleAddTime(task._id, btn.duration)
                            }
                            disabled={isPending}
                          >
                            +{btn.label}
                          </Button>
                        ))}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">
                      Today: {formatTime(task.todayTime ?? 0)}
                    </p>
                    <p className="text-gray-500">
                      Total: {formatTime(task.totalTime ?? 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
