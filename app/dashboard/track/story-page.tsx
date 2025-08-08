"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboardData } from "../../../shared/features/dashboard/_hooks/use-dashboard-data";
import { useTaskOperations } from "../../../shared/features/dashboard/_hooks/use-task-operations";
import { StoryDailySummary } from "../../../shared/features/dashboard/track/story-daily-summary";
import { AddTaskButton } from "../../../shared/features/dashboard/track/add-task-button";
import { AddTaskForm } from "../../../shared/features/dashboard/track/add-task-form";
import { StoryTasksGrid } from "../../../shared/features/dashboard/track/story-tasks-grid";
import { LoadingSkeleton } from "../../../shared/features/dashboard/track/loading-skeleton";
import { CelebrationMoments } from "../../../shared/components/visual-stories/celebration-moments";
import { TaskColorKey } from "../../../convex/utils";

export default function StoryTrackPage() {
  const { tasks, totalToday, dailyGoalMinutes, isLoading } = useDashboardData();
  const { createTask } = useTaskOperations();

  const [showAddTask, setShowAddTask] = useState(false);
  const [celebration, setCelebration] = useState<{
    trigger:
      | "timeAdded"
      | "taskCompleted"
      | "streak"
      | "milestone"
      | "goalReached";
    value?: number;
    milestone?: string;
  } | null>(null);

  // Track previous state for celebrations
  const [prevTotalToday, setPrevTotalToday] = useState(totalToday);

  const handleCreateTask = async (
    title: string,
    topic?: string,
    color?: TaskColorKey,
  ) => {
    await createTask(title, topic, color);
    setShowAddTask(false);

    // Celebrate first task creation
    if (tasks.length === 0) {
      setCelebration({
        trigger: "taskCompleted",
        milestone: "First task created! Your journey begins...",
      });
    }
  };

  const handleCancelTask = () => {
    setShowAddTask(false);
  };

  // Detect celebrations based on state changes
  useEffect(() => {
    // Time added celebration
    if (totalToday > prevTotalToday && prevTotalToday > 0) {
      const addedTime = totalToday - prevTotalToday;
      setCelebration({
        trigger: "timeAdded",
        value: addedTime,
      });
    }

    // Goal reached celebration (user-configurable)
    if (totalToday >= dailyGoalMinutes && prevTotalToday < dailyGoalMinutes) {
      setCelebration({
        trigger: "goalReached",
        milestone: "Daily goal conquered!",
      });
    }

    // Milestone celebrations
    const milestones = [60, 120, 240, 360]; // 1h, 2h, 4h, 6h
    const currentMilestone = milestones.find(
      (m) => totalToday >= m && prevTotalToday < m,
    );
    if (currentMilestone) {
      setCelebration({
        trigger: "milestone",
        milestone: `${Math.floor(currentMilestone / 60)} hour${currentMilestone >= 120 ? "s" : ""} of focused work!`,
      });
    }

    setPrevTotalToday(totalToday);
  }, [totalToday, prevTotalToday, dailyGoalMinutes]);

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
    <>
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Story-driven daily summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <StoryDailySummary
            totalToday={totalToday}
            tasks={tasks}
            targetMinutes={dailyGoalMinutes}
          />
        </motion.div>

        {/* Add task button with story context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AddTaskButton
            onAddTask={() => setShowAddTask(true)}
            disabled={showAddTask}
          />
        </motion.div>

        {/* Add task form with smooth animation */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <AddTaskForm
                onCreateTask={handleCreateTask}
                onCancel={handleCancelTask}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story-driven tasks grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <StoryTasksGrid
            tasks={tasks}
            onAddTask={() => setShowAddTask(true)}
          />
        </motion.div>
      </motion.div>

      {/* Celebration moments */}
      <AnimatePresence>
        {celebration && (
          <CelebrationMoments
            trigger={celebration.trigger}
            value={celebration.value}
            milestone={celebration.milestone}
            onComplete={() => setCelebration(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
