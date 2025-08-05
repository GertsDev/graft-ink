"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatTime, formatGrowth } from "../_utils/format-utils";
import { type WeeklyComparisonItem } from "./_types/analytics-types";

interface WeeklyProgressProps {
  weeklyData: WeeklyComparisonItem[];
}

export function WeeklyProgress({ weeklyData }: WeeklyProgressProps) {
  const maxMinutes = Math.max(...weeklyData.map(w => w.totalMinutes), 1);

  return (
    <div className="space-y-4">
      {weeklyData.map((week, index) => {
        const weekLabel = `Week ${index + 1}`;
        const heightPercentage = (week.totalMinutes / maxMinutes) * 100;
        
        const GrowthIcon = week.growth > 0 ? TrendingUp : week.growth < 0 ? TrendingDown : Minus;
        const growthColor = week.growth > 0 ? "text-green-600" : week.growth < 0 ? "text-red-600" : "text-gray-400";

        return (
          <motion.div
            key={week.weekStart}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            {/* Week label */}
            <div className="w-16 text-sm text-gray-600">
              {weekLabel}
            </div>

            {/* Progress bar */}
            <div className="flex-1 relative">
              <div className="h-8 bg-gray-100 rounded-md overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${heightPercentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-analyze-3 to-analyze-4 rounded-md"
                />
              </div>
              
              {/* Time label on bar */}
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-sm font-medium text-gray-700">
                  {formatTime(week.totalMinutes)}
                </span>
              </div>
            </div>

            {/* Growth indicator */}
            {index > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className={`flex items-center gap-1 text-sm ${growthColor}`}
              >
                <GrowthIcon className="h-4 w-4" />
                <span>{formatGrowth(week.growth)}</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}