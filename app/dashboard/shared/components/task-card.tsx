"use client";

import { useState } from "react";
import { PenLine, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useTaskOperations } from "../hooks/use-task-operations";
import { useTimeDurations } from "../../../hooks/use-time-durations";
import { Id } from "../../../../convex/_generated/dataModel";

interface TaskWithTime {
  _id: Id<"tasks">;
  _creationTime: number;
  title: string;
  topic?: string;
  createdAt: number;
  userId: Id<"users">;
  totalTime?: number;
  todayTime?: number;
}

interface Props {
  task: TaskWithTime;
}

export default function TaskCard({ task }: Props) {
  const { addTime, updateTask, deleteTask } = useTaskOperations();
  const [timeDurations, setTimeDurations] = useTimeDurations();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempTopic, setTempTopic] = useState(task.topic ?? "");
  const [tempDurations, setTempDurations] = useState<string[]>(
    timeDurations.map(String),
  );

  const isTempDurationsValid = tempDurations.every((d) => {
    const n = parseInt(d, 10);
    return !isNaN(n) && n > 0;
  });

  const handleTempDurationChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    setTempDurations((prev) =>
      prev.map((d, i) => (i === index ? sanitized : d)),
    );
  };

  const handleSaveEdits = async () => {
    if (!isTempDurationsValid || !tempTitle.trim()) return;

    setIsLoading(true);
    try {
      const nums = tempDurations.map((d) => parseInt(d, 10));

      // Update task and durations in parallel
      await Promise.all([
        updateTask(task._id, tempTitle.trim(), tempTopic.trim() || undefined),
        setTimeDurations(nums),
      ]);

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTime = async (duration: number) => {
    setIsLoading(true);
    try {
      await addTime(task._id, duration);
    } catch (error) {
      console.error("Failed to add time:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      await deleteTask(task._id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="w-full">
            {isEditing ? (
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
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete task"
                  onClick={handleDeleteTask}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Save changes"
                  onClick={handleSaveEdits}
                  disabled={
                    !isTempDurationsValid || !tempTitle.trim() || isLoading
                  }
                >
                  <Check
                    className={
                      `h-4 w-4 ` +
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
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
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
            {isEditing
              ? tempDurations.map((dur, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={dur}
                    onChange={(e) =>
                      handleTempDurationChange(idx, e.currentTarget.value)
                    }
                    className="w-16 appearance-none rounded-md border px-2 py-1 text-center"
                  />
                ))
              : timeDurations.map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    onClick={() => handleAddTime(d)}
                    disabled={isLoading}
                  >
                    +{d}m
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
  );
}
