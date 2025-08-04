"use client";

import { useState } from "react";
import { PenLine, Trash2, Check, Sparkles, Zap, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useTaskOperations } from "../_hooks/use-task-operations";
import { useTimeDurations } from "../_hooks/use-time-durations";
import { formatTime } from "../_utils/time-utils";
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
  const [justAddedTime, setJustAddedTime] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
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
    setJustAddedTime(duration);
    
    try {
      await addTime(task._id, duration);
      
      // Show celebration for milestone moments
      const newTotal = (task.todayTime ?? 0) + duration;
      if (newTotal >= 60 && (task.todayTime ?? 0) < 60) {
        setCelebrationMessage("First hour crushed! \ud83d\ude80");
        setShowCelebration(true);
      } else if (newTotal >= 120 && (task.todayTime ?? 0) < 120) {
        setCelebrationMessage("Two hours strong! \ud83d\udcaa");
        setShowCelebration(true);
      } else if (newTotal >= 180 && (task.todayTime ?? 0) < 180) {
        setCelebrationMessage("Three hours legend! \ud83c\udfc6");
        setShowCelebration(true);
      }
      
      // Clear celebration after delay
      setTimeout(() => {
        setShowCelebration(false);
        setCelebrationMessage("");
      }, 2000);
      
    } catch (error) {
      console.error("Failed to add time:", error);
    } finally {
      setIsLoading(false);
      // Clear the just-added animation after a delay
      setTimeout(() => setJustAddedTime(null), 1000);
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

  // Encouraging messages based on time
  const getEncouragingMessage = () => {
    const todayTime = task.todayTime ?? 0;
    if (todayTime === 0) return "Ready to start? \ud83c\udf1f";
    if (todayTime >= 180) return "Absolutely crushing it today! \ud83d\udd25";
    if (todayTime >= 120) return "On fire today! \ud83d\ude80";
    if (todayTime >= 60) return "Great momentum! \ud83d\udcab";
    return "Building momentum... \u26a1";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="relative"
    >
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-analyze-1/20 to-analyze-2/20 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-lg font-bold text-analyze-1 shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                {celebrationMessage}
                <Trophy className="h-5 w-5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle background glow for active tasks */}
        {(task.todayTime ?? 0) > 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-analyze-1/5 to-analyze-2/5" />
        )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="w-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="focus:ring-ring/20 focus:border-primary w-full rounded-md border px-2 py-1 text-base font-semibold transition-all duration-200 focus:ring-2"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={tempTopic}
                  onChange={(e) => setTempTopic(e.target.value)}
                  className="focus:ring-ring/20 focus:border-primary mt-1 w-full rounded-md border px-2 py-1 text-sm transition-all duration-200 focus:ring-2"
                  placeholder="Topic (optional)"
                />
              </>
            ) : (
              <>
                <h3 className="font-semibold transition-colors duration-200">
                  {task.title}
                </h3>
                {task.topic && (
                  <p className="text-sm text-gray-500 transition-colors duration-200">
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
                    className="focus:ring-ring/20 focus:border-primary w-16 appearance-none rounded-md border px-2 py-1 text-center transition-all duration-200 focus:ring-2"
                  />
                ))
              : timeDurations.map((d) => (
                  <motion.div key={d}>
                    <Button
                      size="sm"
                      onClick={() => handleAddTime(d)}
                      disabled={isLoading}
                      className={`relative overflow-hidden transition-all duration-200 hover:scale-110 active:scale-95 ${
                        justAddedTime === d
                          ? "bg-analyze-1 text-white shadow-lg animate-bounce"
                          : ""
                      }`}
                    >
                      {/* Sparkle effect for recently clicked button */}
                      {justAddedTime === d && (
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 rounded-md bg-analyze-1/30"
                        />
                      )}
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-10 flex items-center gap-1"
                      >
                        {isLoading && justAddedTime === d ? (
                          <Zap className="h-3 w-3 animate-spin" />
                        ) : null}
                        +{d}m
                      </motion.span>
                    </Button>
                  </motion.div>
                ))}
          </div>
          <div className="text-right text-sm">
            <motion.p 
              className="font-medium transition-all duration-300"
              animate={justAddedTime ? { scale: [1, 1.1, 1], color: "var(--analyze-1)" } : {}}
              transition={{ duration: 0.5 }}
            >
              Today:{" "}
              <span className="font-mono">
                {formatTime(task.todayTime ?? 0)}
              </span>
            </motion.p>
            <p className="text-gray-500 transition-colors duration-200">
              Total:{" "}
              <span className="font-mono">
                {formatTime(task.totalTime ?? 0)}
              </span>
            </p>
            {/* Encouraging micro-copy */}
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-analyze-2 mt-1 font-medium"
            >
              {getEncouragingMessage()}
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
