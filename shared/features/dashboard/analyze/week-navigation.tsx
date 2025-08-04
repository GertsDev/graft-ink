"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useWeekNavigation } from "../_hooks/use-week-navigation";
import { WeekBarChart } from "./week-bar-chart";
import { formatTime, formatWeekRange, formatGrowth } from "../_utils/format-utils";

interface WeekNavigationProps {
  dayStartHour: number;
}

export function WeekNavigation({ dayStartHour }: WeekNavigationProps) {
  const {
    weekData,
    isLoading,
    weekOffset,
    navigateToPreviousWeek,
    navigateToNextWeek,
    canNavigateNext,
  } = useWeekNavigation(dayStartHour);

  if (isLoading || !weekData) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const {
    weekInfo,
    weekStats,
    dailyData,
    topicBreakdown,
    comparison,
  } = weekData;

  const isCurrentWeek = weekOffset === 0;
  const weekLabel = isCurrentWeek ? "This Week" : 
                   weekOffset === -1 ? "Last Week" : 
                   `${Math.abs(weekOffset)} weeks ago`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Week Navigation Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <motion.div
                key={weekOffset}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {weekLabel}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {formatWeekRange(weekInfo.startDate, weekInfo.endDate)}
                </p>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToPreviousWeek}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToNextWeek}
                disabled={!canNavigateNext}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Week Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(weekStats.totalMinutes)}
              </p>
              <p className="text-sm text-gray-600">Total Time</p>
              {comparison.growth !== 0 && (
                <p className={`text-xs mt-1 ${
                  comparison.growth > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatGrowth(comparison.growth)} vs last week
                </p>
              )}
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {weekStats.activeDays}
              </p>
              <p className="text-sm text-gray-600">Active Days</p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(weekStats.consistency)}% consistency
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {weekStats.totalTasks}
              </p>
              <p className="text-sm text-gray-600">Tasks</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(weekStats.averagePerDay)}
              </p>
              <p className="text-sm text-gray-600">Avg/Day</p>
            </div>
          </motion.div>

          {/* Daily Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden"
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Activity</h4>
            <WeekBarChart
              data={dailyData.map((day: any) => ({
                date: day.date,
                topics: Object.entries(day.topics).map(([topic, time]) => ({
                  topic,
                  time,
                  color: getTopicColor(topic),
                })),
                total: day.totalMinutes,
              }))}
              formatTime={formatTime}
              formatDate={(dateString: string) => {
                const date = new Date(dateString);
                return date.toLocaleDateString("en-US", { weekday: "short" });
              }}
            />
          </motion.div>
        </CardContent>
      </Card>

      {/* Topic Breakdown */}
      {Object.keys(topicBreakdown).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Topic Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  const sortedTopics = Object.entries(topicBreakdown)
                    .sort(([, a], [, b]) => (b as any).totalMinutes - (a as any).totalMinutes);
                  
                  // Filter topics with at least 5% or show top 5, whichever gives more meaningful data
                  const significantTopics = sortedTopics.filter(([, data]) => (data as any).percentage >= 5);
                  const topicsToShow = significantTopics.length >= 3 ? significantTopics.slice(0, 6) : sortedTopics.slice(0, 5);
                  
                  // Calculate "Other" category if we have filtered out topics
                  const shownTopics = new Set(topicsToShow.map(([topic]) => topic));
                  const otherTopics = sortedTopics.filter(([topic]) => !shownTopics.has(topic));
                  const otherTotal = otherTopics.reduce((sum, [, data]) => sum + (data as any).totalMinutes, 0);
                  const otherPercentage = otherTopics.reduce((sum, [, data]) => sum + (data as any).percentage, 0);
                  
                  const finalTopics = [...topicsToShow];
                  if (otherTopics.length > 0 && otherPercentage >= 2) {
                    finalTopics.push(['Other', { totalMinutes: otherTotal, percentage: otherPercentage }]);
                  }
                  
                  return finalTopics.map(([topic, data], index) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-4 h-4 rounded ${topic === 'Other' ? 'bg-gray-400' : getTopicColor(topic)}`}
                        />
                        <span className={`font-medium ${topic === 'Other' ? 'text-gray-500 text-sm' : ''}`}>
                          {topic === 'Other' ? `Other (${(data as any).taskCount || 'multiple'} topics)` : topic}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          {formatTime((data as any).totalMinutes)}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({(data as any).percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </motion.div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper function for consistent topic colors
function getTopicColor(topic: string): string {
  const colors = [
    "bg-analyze-1",
    "bg-analyze-2", 
    "bg-analyze-3",
    "bg-analyze-4",
    "bg-analyze-5",
  ];
  
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}