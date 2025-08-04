"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Award,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Clock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { useMonthAnalytics } from "../_hooks/use-month-analytics";
import { 
  formatTime, 
  formatMonthYear, 
  formatPercentage,
  formatGrowth
} from "../_utils/format-utils";
import { CalendarHeatmap } from "./calendar-heatmap";
import { MonthlyMilestones } from "./monthly-milestones";
import { WeeklyProgress } from "./weekly-progress";
import { AnimatedCounter } from "./animated-counter";
import { FloatingElements } from "./floating-elements";
import { WhimsicalLoading } from "./whimsical-loading";

interface MonthAnalyticsProps {
  dayStartHour: number;
}

export function MonthAnalytics({ dayStartHour }: MonthAnalyticsProps) {
  const {
    monthData,
    isLoading,
    currentMonth,
    currentYear,
    navigateToPreviousMonth,
    navigateToNextMonth,
    canNavigateNext,
  } = useMonthAnalytics(dayStartHour);

  if (isLoading || !monthData) {
    return <WhimsicalLoading />;
  }

  const {
    monthStats,
    dailyBreakdown,
    topicSummary,
    weeklyComparison,
    milestones,
  } = monthData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between">
        <motion.h2 
          className="text-2xl font-light text-gray-900"
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {formatMonthYear(currentYear, currentMonth)}
        </motion.h2>
        
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToPreviousMonth}
              className="h-8 w-8 p-0 hover:bg-analyze-1/10 transition-all duration-200"
            >
              <motion.div
                whileHover={{ x: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToNextMonth}
              disabled={!canNavigateNext}
              className="h-8 w-8 p-0 hover:bg-analyze-1/10 transition-all duration-200 disabled:opacity-50"
            >
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Month Overview Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, staggerChildren: 0.05 }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-analyze-1 to-analyze-2 text-white relative overflow-hidden">
            <FloatingElements count={3} />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Time</p>
                  <AnimatedCounter
                    value={monthStats.totalMinutes}
                    format={(v) => formatTime(v)}
                    className="text-2xl font-bold"
                    delay={200}
                  />
                  <p className="text-white/60 text-xs">
                    <AnimatedCounter
                      value={monthStats.averagePerDay}
                      format={(v) => `${formatTime(v)} avg/day`}
                      delay={400}
                    />
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Clock className="h-8 w-8 text-white/60" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-analyze-3 to-analyze-4 text-white relative overflow-hidden">
            <FloatingElements count={3} />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Consistency</p>
                  <AnimatedCounter
                    value={monthStats.consistency}
                    format={(v) => formatPercentage(v)}
                    className="text-2xl font-bold"
                    delay={600}
                  />
                  <p className="text-white/60 text-xs">
                    <AnimatedCounter
                      value={monthStats.totalDays}
                      format={(v) => `${v} active days`}
                      delay={800}
                    />
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Target className="h-8 w-8 text-white/60" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-analyze-4 to-analyze-5 text-white relative overflow-hidden">
            <FloatingElements count={3} />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Longest Streak</p>
                  <AnimatedCounter
                    value={monthStats.longestStreak}
                    className="text-2xl font-bold"
                    delay={1000}
                  />
                  <p className="text-white/60 text-xs">
                    {monthStats.longestStreak === 1 ? "day" : "days"}
                  </p>
                </div>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Award className="h-8 w-8 text-white/60" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Calendar Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap 
              dailyData={dailyBreakdown}
              year={currentYear}
              month={currentMonth}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Topic Breakdown & Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(topicSummary)
                .sort(([, a], [, b]) => (b as any).totalMinutes - (a as any).totalMinutes)
                .slice(0, 5)
                .map(([topic, data], index) => {
                  const topicData = data as any;
                  return (
                  <motion.div
                    key={topic}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{topic}</span>
                      <div className="text-right">
                        <span className="text-gray-900">{formatTime(topicData.totalMinutes)}</span>
                        <span className="text-gray-500 ml-2">
                          {formatPercentage(topicData.percentage)}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={topicData.percentage} 
                      className="h-2"
                    />
                  </motion.div>
                  );
                })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyProgress weeklyData={weeklyComparison} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <MonthlyMilestones milestones={milestones} />
      </motion.div>
    </motion.div>
  );
}