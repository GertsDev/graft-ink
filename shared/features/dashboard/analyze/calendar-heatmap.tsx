"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { formatTime } from "../_utils/format-utils";

interface CalendarHeatmapProps {
  dailyData: Array<{
    date: string;
    totalMinutes: number;
    tasksCount: number;
    topics: Record<string, number>;
  }>;
  year: number;
  month: number;
}

export function CalendarHeatmap({ dailyData, year, month }: CalendarHeatmapProps) {
  const { calendar, maxMinutes } = useMemo(() => {
    // Create calendar grid
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const calendar: Array<{
      day: number | null;
      date: string | null;
      minutes: number;
      tasksCount: number;
      isToday: boolean;
      isCurrentMonth: boolean;
    }> = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push({ 
        day: null, 
        date: null, 
        minutes: 0, 
        tasksCount: 0, 
        isToday: false, 
        isCurrentMonth: false 
      });
    }

    // Add days of the month
    const today = new Date();
    const isCurrentMonthAndYear = today.getFullYear() === year && today.getMonth() === month;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const dayData = dailyData.find(d => d.date === date);
      
      calendar.push({
        day,
        date,
        minutes: dayData?.totalMinutes || 0,
        tasksCount: dayData?.tasksCount || 0,
        isToday: isCurrentMonthAndYear && today.getDate() === day,
        isCurrentMonth: true,
      });
    }

    // Fill remaining cells to complete the grid (42 cells = 6 rows × 7 days)
    while (calendar.length < 42) {
      calendar.push({ 
        day: null, 
        date: null, 
        minutes: 0, 
        tasksCount: 0, 
        isToday: false, 
        isCurrentMonth: false 
      });
    }

    const maxMinutes = Math.max(...dailyData.map(d => d.totalMinutes), 1);

    return { calendar, maxMinutes };
  }, [dailyData, year, month]);

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return "bg-gray-100";
    const intensity = minutes / maxMinutes;
    if (intensity <= 0.25) return "bg-analyze-1/30";
    if (intensity <= 0.5) return "bg-analyze-2/50";
    if (intensity <= 0.75) return "bg-analyze-3/70";
    return "bg-analyze-4/90";
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="space-y-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-medium">
        {weekDays.map((day, index) => (
          <div key={index} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((cell, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={`
              aspect-square rounded-md border transition-all duration-200 hover:scale-110
              ${cell.isCurrentMonth ? "cursor-pointer" : ""}
              ${cell.isToday ? "ring-2 ring-analyze-4" : "border-gray-200"}
              ${cell.day ? getIntensityClass(cell.minutes) : "bg-transparent border-transparent"}
            `}
            title={
              cell.day && cell.date
                ? `${cell.day} - ${formatTime(cell.minutes)} (${cell.tasksCount} tasks)`
                : ""
            }
          >
            {cell.day && (
              <div className="w-full h-full flex items-center justify-center">
                <span 
                  className={`
                    text-xs font-medium
                    ${cell.minutes > maxMinutes * 0.5 ? "text-white" : "text-gray-700"}
                    ${cell.isToday ? "font-bold" : ""}
                  `}
                >
                  {cell.day}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
          <div className="w-3 h-3 rounded-sm bg-analyze-1/30"></div>
          <div className="w-3 h-3 rounded-sm bg-analyze-2/50"></div>
          <div className="w-3 h-3 rounded-sm bg-analyze-3/70"></div>
          <div className="w-3 h-3 rounded-sm bg-analyze-4/90"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}