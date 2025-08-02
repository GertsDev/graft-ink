"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import TaskCard from "../components/task-card";
import { type Doc } from "../../../../convex/_generated/dataModel";

interface TasksGridProps {
  tasks: Doc<"tasks">[];
}

export function TasksGrid({ tasks }: TasksGridProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => b._creationTime - a._creationTime);
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card className="animate-in fade-in-0 duration-300">
        <CardContent className="p-6 text-center text-gray-500">
          No tasks yet. Create your first task to start tracking time.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {sortedTasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}