"use client";

import { useState } from "react";

import { PenLine, Trash2, Check } from "lucide-react";

import { useTrack } from "./track-context";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

interface TaskWithTime {
  _id: Id<"tasks">;
  _creationTime: number;
  id: string;
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
  const {
    timeDurations,
    setTimeDurations,
    setOptimistic,
    startTrans,
    isPending,
    addTime,
    deleteTask,
    updateTask,
  } = useTrack();

  const [openEdit, setOpenEdit] = useState(false);
  const [tempDurations, setTempDurations] = useState<string[]>(
    timeDurations.map(String),
  );
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempTopic, setTempTopic] = useState(task.topic ?? "");

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

  const applyEdits = () => {
    if (!isTempDurationsValid || !tempTitle.trim()) return;

    const nums = tempDurations.map((d) => parseInt(d, 10));

    startTrans(() => {
      // optimistic updates
      setOptimistic({
        type: "updateTask",
        taskId: task._id,
        title: tempTitle.trim(),
        topic: tempTopic.trim() || undefined,
      });
      setTimeDurations(nums);

      updateTask({
        taskId: task._id,
        title: tempTitle.trim(),
        topic: tempTopic.trim() || undefined,
      });
    });

    setOpenEdit(false);
  };

  const handleAddTime = (duration: number) => {
    startTrans(() => {
      setOptimistic({
        type: "addTime",
        taskId: task._id,
        duration,
      });
      addTime({ taskId: task._id, duration });
    });
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
            {openEdit ? (
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
            {openEdit ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete task"
                  onClick={() => {
                    startTrans(() => {
                      setOptimistic({ type: "deleteTask", taskId: task._id });
                      deleteTask({ taskId: task._id });
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Apply changes"
                  onClick={applyEdits}
                  disabled={!isTempDurationsValid || !tempTitle.trim()}
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
                onClick={() => setOpenEdit(true)}
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
            {openEdit
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
                    disabled={isPending}
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
