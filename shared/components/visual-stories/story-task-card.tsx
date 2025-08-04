"use client";

import React, { useState } from "react";
import { PenLine, Trash2, Check, Sprout, TreePine, Crown, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useTaskOperations } from "../../features/dashboard/_hooks/use-task-operations";
import { useTimeDurations } from "../../features/dashboard/_hooks/use-time-durations";
import { formatTime } from "../../features/dashboard/_utils/time-utils";
import { Id } from "../../../convex/_generated/dataModel";

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

export default function StoryTaskCard({ task }: Props) {
  const { addTime, updateTask, deleteTask } = useTaskOperations();
  const [timeDurations, setTimeDurations] = useTimeDurations();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempTopic, setTempTopic] = useState(task.topic ?? "");
  const [tempDurations, setTempDurations] = useState<string[]>(
    timeDurations.map(String),
  );
  const [justGotTime, setJustGotTime] = useState(false);

  const isTempDurationsValid = tempDurations.every((d) => {
    const n = parseInt(d, 10);
    return !isNaN(n) && n > 0;
  });

  // Extract growth stage logic to a utility function for reusability
  const getGrowthStage = React.useMemo(() => {
    const totalMinutes = task.totalTime ?? 0;
    if (totalMinutes === 0) return { icon: Sprout, stage: "seed", color: "text-gray-400", bgColor: "bg-gray-50", message: "Ready to sprout" };
    if (totalMinutes < 60) return { icon: Sprout, stage: "sprout", color: "text-green-500", bgColor: "bg-green-50", message: "First growth" };
    if (totalMinutes < 180) return { icon: TreePine, stage: "sapling", color: "text-green-600", bgColor: "bg-green-100", message: "Growing strong" };
    if (totalMinutes < 360) return { icon: TreePine, stage: "tree", color: "text-emerald-600", bgColor: "bg-emerald-100", message: "Flourishing" };
    return { icon: Crown, stage: "master", color: "text-amber-600", bgColor: "bg-amber-100", message: "Mastery achieved" };
  }, [task.totalTime]);

  const growth = getGrowthStage;
  const GrowthIcon = growth.icon;

  // Today's progress visualization
  const todayProgress = Math.min((task.todayTime ?? 0) / 60, 1); // Progress towards 1 hour

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
    setJustGotTime(true);
    try {
      await addTime(task._id, duration);
      // Reset the celebration after animation
      setTimeout(() => setJustGotTime(false), 2000);
    } catch (error) {
      console.error("Failed to add time:", error);
      setJustGotTime(false);
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-analyze-2/30">
        {/* Growth stage background indicator */}
        <div className={`absolute top-0 left-0 w-full h-1 ${growth.bgColor.replace('bg-', 'bg-gradient-to-r from-')}-200 to-transparent opacity-60`} />
        
        {/* Time celebration effect */}
        <AnimatePresence>
          {justGotTime && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-analyze-1/20 to-analyze-2/20 pointer-events-none"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="w-full">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="focus:ring-analyze-1/30 focus:border-analyze-1 w-full rounded-md border px-2 py-1 text-base font-semibold transition-all duration-200 focus:ring-2"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={tempTopic}
                    onChange={(e) => setTempTopic(e.target.value)}
                    className="focus:ring-analyze-1/30 focus:border-analyze-1 mt-1 w-full rounded-md border px-2 py-1 text-sm transition-all duration-200 focus:ring-2"
                    placeholder="Topic (optional)"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      animate={justGotTime ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <GrowthIcon className={`w-4 h-4 ${growth.color}`} />
                    </motion.div>
                    <span className={`text-xs px-2 py-1 rounded-full ${growth.bgColor} ${growth.color} font-medium`}>
                      {growth.message}
                    </span>
                  </div>
                  <h3 className="font-semibold transition-colors duration-200">
                    {task.title}
                  </h3>
                  {task.topic && (
                    <p className="text-sm text-muted-foreground transition-colors duration-200">
                      {task.topic}
                    </p>
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
                    className="transition-all duration-200 hover:scale-110 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 transition-colors duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Save changes"
                    onClick={handleSaveEdits}
                    disabled={
                      !isTempDurationsValid || !tempTitle.trim() || isLoading
                    }
                    className="transition-all duration-200 hover:scale-110 hover:bg-green-50"
                  >
                    <Check
                      className={
                        `h-4 w-4 transition-colors duration-200 ` +
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
                  className="transition-all duration-200 hover:scale-110"
                >
                  <PenLine className="h-4 w-4 transition-colors duration-200" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Today's progress visualization */}
          {(task.todayTime ?? 0) > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Today&apos;s momentum</span>
                <span>{formatTime(task.todayTime ?? 0)}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-analyze-1 to-analyze-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgress * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

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
                      className="focus:ring-analyze-1/30 focus:border-analyze-1 w-16 appearance-none rounded-md border px-2 py-1 text-center transition-all duration-200 focus:ring-2"
                    />
                  ))
                : timeDurations.map((d) => (
                    <motion.div key={d} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={() => handleAddTime(d)}
                        disabled={isLoading}
                        className="relative transition-all duration-200 hover:scale-105 bg-gradient-to-r from-analyze-1 to-analyze-2 hover:from-analyze-2 hover:to-analyze-3 text-white border-0"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        +{d}m
                        {justGotTime && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-analyze-2 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 0] }}
                            transition={{ duration: 1 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  ))}
            </div>
            <div className="text-right text-sm">
              <motion.p 
                className="font-medium"
                animate={justGotTime ? { scale: [1, 1.1, 1] } : {}}
              >
                Today:{" "}
                <span className="font-mono text-analyze-1">
                  {formatTime(task.todayTime ?? 0)}
                </span>
              </motion.p>
              <p className="text-muted-foreground">
                Total:{" "}
                <span className="font-mono">
                  {formatTime(task.totalTime ?? 0)}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}