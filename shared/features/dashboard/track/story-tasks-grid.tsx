"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import StoryTaskCard from "../../../components/visual-stories/story-task-card";
import { EmptyStateStory } from "../../../components/visual-stories/empty-state-story";
import { type Doc } from "../../../../convex/_generated/dataModel";

interface StoryTasksGridProps {
  tasks: Doc<"tasks">[];
  onAddTask?: () => void;
}

export function StoryTasksGrid({ tasks, onAddTask }: StoryTasksGridProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => b._creationTime - a._creationTime);
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <EmptyStateStory
        type="tasks"
        onAction={onAddTask}
        actionLabel="Create Your First Task"
      />
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              layout: { duration: 0.4 }
            }}
          >
            <StoryTaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}