"use client";

import React from "react";
import { ProgressJourney } from "../../../components/visual-stories/progress-journey";
import { type Doc } from "../../../../convex/_generated/dataModel";

interface StoryDailySummaryProps {
  totalToday: number;
  tasks: (Doc<"tasks"> & { todayTime?: number })[];
  targetMinutes?: number;
}

export function StoryDailySummary({ 
  totalToday, 
  tasks, 
  targetMinutes = 180 
}: StoryDailySummaryProps) {
  const tasksWithTime = tasks.filter(t => (t.todayTime ?? 0) > 0);

  return (
    <ProgressJourney
      currentMinutes={totalToday}
      targetMinutes={targetMinutes}
      tasksCompleted={tasksWithTime.length}
    />
  );
}