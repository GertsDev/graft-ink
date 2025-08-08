"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { formatTime } from "../_utils/time-utils";
import { type Doc } from "../../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Target, Zap, Trophy, Star } from "lucide-react";

interface DailySummaryProps {
  totalToday: number;
  tasks: (Doc<"tasks"> & { todayTime?: number })[];
  targetMinutes?: number;
}

export function DailySummary({
  totalToday,
  tasks,
  targetMinutes = 480,
}: DailySummaryProps) {
  const [displayTime, setDisplayTime] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);

  // Animate the time counter on mount and when it changes
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 50;
    const increment = totalToday / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalToday) {
        setDisplayTime(totalToday);
        clearInterval(timer);
        // Show motivation message after animation
        setTimeout(() => setShowMotivation(true), 200);
      } else {
        setDisplayTime(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalToday]);

  // Progress calculation (targetMinutes = 100%)
  const progressPercent = Math.min(100, (totalToday / targetMinutes) * 100);

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (totalToday === 0)
      return {
        text: "Ready to make magic happen?",
        icon: Star,
        color: "text-analyze-2",
      };
    if (totalToday >= 300)
      return {
        text: "Legendary productivity mode!",
        icon: Trophy,
        color: "text-analyze-1",
      };
    if (totalToday >= 240)
      return {
        text: "Absolutely on fire today!",
        icon: Flame,
        color: "text-analyze-2",
      };
    if (totalToday >= targetMinutes)
      return {
        text: "Daily goal crushed!",
        icon: Target,
        color: "text-analyze-3",
      };
    if (totalToday >= 120)
      return {
        text: "Momentum building nicely!",
        icon: Zap,
        color: "text-analyze-4",
      };
    if (totalToday >= 60)
      return { text: "Great start today!", icon: Zap, color: "text-analyze-5" };
    return {
      text: "Every minute counts!",
      icon: Star,
      color: "text-analyze-2",
    };
  };

  const motivation = getMotivationalMessage();
  const MotivationIcon = motivation.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="dark:from-card dark:to-card/50 relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex-1">
            <motion.h2
              className="text-2xl font-bold transition-all duration-300"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.span
                className="from-analyze-1 to-analyze-2 bg-gradient-to-r bg-clip-text font-mono text-transparent"
                key={displayTime} // Re-trigger animation when time changes
                initial={{ scale: 1.2, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatTime(displayTime)}
              </motion.span>
              <span className="text-muted-foreground ml-2">TODAY</span>
            </motion.h2>

            {/* Motivational message */}
            <AnimatePresence>
              {showMotivation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 }}
                  className={`flex items-center gap-1 text-sm font-medium ${motivation.color} mt-1`}
                >
                  <MotivationIcon className="h-4 w-4" />
                  {motivation.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            className="text-muted-foreground text-right text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {tasks
              .filter((t) => (t.todayTime ?? 0) > 0)
              .slice(0, 2)
              .map((t, index) => (
                <motion.p
                  key={t._id}
                  className="transition-all duration-200"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {t.title}:{" "}
                  <span className="text-analyze-1 font-mono">
                    {formatTime(t.todayTime ?? 0)}
                  </span>
                </motion.p>
              ))}
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Progress bar container with glow effect */}
            <div className="bg-secondary/50 border-border/50 flex h-3 w-full overflow-hidden rounded-full border">
              {/* Background glow */}
              <div className="from-analyze-1/10 to-analyze-2/10 absolute inset-0 rounded-full bg-gradient-to-r" />

              {/* Animated progress bar */}
              <motion.div
                className="from-analyze-1 to-analyze-2 relative h-full rounded-full bg-gradient-to-r shadow-sm"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Progress milestones */}
                {progressPercent > 0 && (
                  <motion.div
                    className="absolute top-0 right-0 h-full w-1 rounded-r-full bg-white/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  />
                )}
              </motion.div>
            </div>

            {/* Progress labels */}
            <div className="text-muted-foreground mt-2 flex justify-between text-xs">
              <span>0h</span>
              <motion.span
                className="text-analyze-1 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {Math.round(progressPercent)}% to goal
              </motion.span>
              <span>{Math.floor(targetMinutes / 60)}h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
