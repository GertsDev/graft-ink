"use client";

import React from "react";
import { Mountain, Sunrise, TreePine, Flag, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface ProgressJourneyProps {
  currentMinutes: number;
  targetMinutes?: number;
  tasksCompleted: number;
}

export function ProgressJourney({
  currentMinutes,
  targetMinutes = 480,
  tasksCompleted,
}: ProgressJourneyProps) {
  const progress = Math.min(currentMinutes / targetMinutes, 1);
  const progressPercent = progress * 100;

  // Memoize milestone calculation for performance
  const getMilestone = React.useMemo(() => {
    if (progress === 0)
      return {
        icon: Sunrise,
        message: "Dawn breaks - your journey begins",
        stage: "start",
      };
    if (progress < 0.25)
      return {
        icon: TreePine,
        message: "First steps through the forest",
        stage: "early",
      };
    if (progress < 0.5)
      return {
        icon: Mountain,
        message: "Climbing the foothills",
        stage: "climbing",
      };
    if (progress < 0.75)
      return {
        icon: Mountain,
        message: "Ascending the peaks",
        stage: "ascending",
      };
    if (progress < 1)
      return { icon: Flag, message: "Summit in sight!", stage: "nearSummit" };
    return {
      icon: Sparkles,
      message: "Summit conquered! New horizons await",
      stage: "victory",
    };
  }, [progress]);

  const milestone = getMilestone;
  const MilestoneIcon = milestone.icon;

  // Path visualization
  const pathPoints = [
    { x: 5, y: 85, stage: "start", label: "Start" },
    { x: 25, y: 70, stage: "early", label: "25%" },
    { x: 50, y: 50, stage: "climbing", label: "50%" },
    { x: 75, y: 30, stage: "ascending", label: "75%" },
    { x: 95, y: 15, stage: "victory", label: "Goal" },
  ];

  // Memoize position calculations
  const currentPosition = React.useMemo(
    () => ({
      x: 5 + progress * 90,
      y: 85 - progress * 70,
    }),
    [progress],
  );

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 p-6 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-amber-100/30 dark:to-slate-600/30" />

      {/* Journey Path SVG */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Mountain silhouette */}
          <path
            d="M0,85 L20,75 L30,65 L45,50 L60,40 L75,25 L90,15 L100,10 L100,100 L0,100 Z"
            fill="url(#mountainGradient)"
            opacity="0.1"
          />

          {/* Journey path */}
          <path
            d="M5,85 Q25,70 50,50 Q75,30 95,15"
            stroke="url(#pathGradient)"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="2,1"
            opacity="0.6"
          />

          {/* Progress path (completed) */}
          <path
            d={`M5,85 Q${Math.min(25, currentPosition.x)},${progress < 0.25 ? 85 - progress * 60 : 70} ${progress < 0.5 ? currentPosition.x : 50},${progress < 0.5 ? currentPosition.y : 50} ${progress < 0.75 ? "" : `Q${Math.min(75, currentPosition.x)},${progress < 0.75 ? 50 : 30} ${currentPosition.x},${currentPosition.y}`}`}
            stroke="url(#completedPathGradient)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Milestones */}
          {pathPoints.map((point, index) => {
            const isReached = progress >= index * 0.25;
            return (
              <circle
                key={point.stage}
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill={
                  isReached ? "var(--analyze-2)" : "var(--muted-foreground)"
                }
                opacity={isReached ? 1 : 0.3}
              />
            );
          })}

          {/* Current position */}
          <motion.circle
            cx={currentPosition.x}
            cy={currentPosition.y}
            r="2"
            fill="var(--analyze-1)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="mountainGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--analyze-4)" />
              <stop offset="100%" stopColor="var(--analyze-1)" />
            </linearGradient>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--muted-foreground)" />
              <stop offset="100%" stopColor="var(--analyze-4)" />
            </linearGradient>
            <linearGradient
              id="completedPathGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--analyze-1)" />
              <stop offset="100%" stopColor="var(--analyze-2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Journey stats */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <motion.div
            className="mb-2 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MilestoneIcon className="h-5 w-5 text-amber-600" />
            <span className="text-muted-foreground text-sm font-medium">
              {milestone.message}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="font-mono text-3xl font-bold">
              {Math.floor(currentMinutes / 60)}h {currentMinutes % 60}m
            </div>
            <div className="text-muted-foreground text-sm">
              of {Math.floor(targetMinutes / 60)}h journey
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-muted-foreground mb-1 text-sm">Progress</div>
          <div className="text-analyze-1 text-2xl font-bold">
            {progressPercent.toFixed(0)}%
          </div>
          {tasksCompleted > 0 && (
            <div className="text-muted-foreground text-xs">
              {tasksCompleted} tasks explored
            </div>
          )}
        </motion.div>
      </div>

      {/* Achievement celebrations */}
      {progress >= 1 && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
        >
          <Sparkles className="h-6 w-6 text-amber-500" />
        </motion.div>
      )}
    </div>
  );
}
