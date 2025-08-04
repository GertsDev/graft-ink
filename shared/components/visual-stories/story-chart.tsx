"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { TrendingUp, Award, Target, Clock, Zap } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../ui/chart";

interface StoryChartProps {
  data: Array<{
    date: string;
    total: number;
    topics?: Array<{ topic: string; time: number }>;
  }>;
  formatTime: (minutes: number) => string;
  formatDate: (dateString: string) => string;
  maxTime: number;
  type?: "week" | "day";
}

export function StoryChart({ 
  data, 
  formatTime, 
  formatDate, 
  maxTime, 
  type = "week" 
}: StoryChartProps) {
  // Analyze data for storytelling insights
  const insights = React.useMemo(() => {
    const totalTime = data.reduce((sum, day) => sum + day.total, 0);
    const avgDaily = totalTime / Math.max(data.length, 1);
    const bestDay = data.reduce((best, day) => day.total > best.total ? day : best, data[0] || { total: 0, date: "" });
    const streak = calculateStreak(data);
    const momentum = calculateMomentum(data);
    
    return {
      totalTime,
      avgDaily,
      bestDay,
      streak,
      momentum,
      consistency: calculateConsistency(data),
    };
  }, [data]);

  const getStoryNarrative = () => {
    if (insights.totalTime === 0) {
      return {
        title: "Your Story Begins",
        subtitle: "Every master was once a beginner",
        insight: "Start tracking time to see your productivity narrative unfold.",
        icon: Target,
        color: "text-gray-500"
      };
    }

    if (insights.momentum > 0.2) {
      return {
        title: "Momentum Building",
        subtitle: "You're on fire! 🔥",
        insight: `Strong upward trend with ${formatTime(Math.round(insights.avgDaily))} average daily focus.`,
        icon: TrendingUp,
        color: "text-green-600"
      };
    }

    if (insights.streak >= 3) {
      return {
        title: "Consistency Champion",
        subtitle: "Steady progress creates lasting change",
        insight: `${insights.streak} days of focused work. You're building something great!`,
        icon: Award,
        color: "text-amber-600"
      };
    }

    return {
      title: "Finding Your Rhythm",
      subtitle: "Every step forward counts",
      insight: `${formatTime(insights.totalTime)} of focused work this period. Keep exploring!`,
      icon: Clock,
      color: "text-blue-600"
    };
  };

  const story = getStoryNarrative();
  const StoryIcon = story.icon;

  // Transform data for recharts
  const chartData = data.map((day) => ({
    day: formatDate(day.date),
    dayFull: day.date,
    total: day.total,
    ...day.topics?.reduce((acc, topic) => {
      acc[topic.topic] = topic.time;
      return acc;
    }, {} as Record<string, number>)
  }));

  // Get all unique topics for stacking
  const allTopics = Array.from(
    new Set(data.flatMap((day) => day.topics?.map((topic) => topic.topic) || []))
  );

  // Create chart config with storytelling colors
  const chartConfig: ChartConfig = {};
  const storyColors = [
    "var(--analyze-1)", "var(--analyze-2)", "var(--analyze-3)", 
    "var(--analyze-4)", "var(--analyze-5)"
  ];

  if (allTopics.length > 0) {
    allTopics.forEach((topic, index) => {
      chartConfig[topic] = {
        label: topic,
        color: storyColors[index % storyColors.length],
      };
    });
  } else {
    chartConfig["total"] = {
      label: "Total Time",
      color: "var(--analyze-1)",
    };
  }

  return (
    <div className="space-y-6">
      {/* Story Header */}
      <motion.div
        className="flex items-start gap-4 p-4 bg-gradient-to-r from-analyze-1/5 to-analyze-2/10 rounded-lg border border-analyze-1/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80">
          <StoryIcon className={`w-5 h-5 ${story.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{story.title}</h3>
          <p className="text-sm text-muted-foreground mb-1">{story.subtitle}</p>
          <p className="text-sm">{story.insight}</p>
        </div>
        {insights.bestDay.total > 0 && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Best Day</div>
            <div className="font-mono font-semibold text-analyze-1">
              {formatTime(insights.bestDay.total)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(insights.bestDay.date)}
            </div>
          </div>
        )}
      </motion.div>

      {/* Chart with storytelling enhancements */}
      <motion.div
        className="h-80 w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
          {type === "week" ? (
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 10, right: 10, left: 50, bottom: 30 }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.3} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value === 0) return "";
                  const h = Math.floor(value / 60);
                  const m = value % 60;
                  if (h && m) return `${h}h ${m}m`;
                  if (h) return `${h}h`;
                  if (m) return `${m}m`;
                  return "";
                }}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                width={50}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0]?.payload;
                  if (!data) return null;

                  return (
                    <div className="bg-background rounded-lg border p-3 shadow-lg">
                      <p className="mb-2 font-medium">{label}</p>
                      <div className="space-y-1">
                        {allTopics.map((topic) => {
                          const value = data[topic];
                          if (!value) return null;
                          return (
                            <div key={topic} className="flex items-center gap-2 text-sm">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: chartConfig[topic]?.color }}
                              />
                              <span>{topic}: {formatTime(value)}</span>
                            </div>
                          );
                        })}
                        <div className="mt-2 border-t pt-1">
                          <span className="text-sm font-medium">
                            Total: {formatTime(data.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              {allTopics.length > 0 ? (
                allTopics.map((topic, index) => (
                  <Bar
                    key={topic}
                    dataKey={topic}
                    stackId="topics"
                    fill={storyColors[index % storyColors.length]}
                    radius={index === allTopics.length - 1 ? [2, 2, 0, 0] : 0}
                  />
                ))
              ) : (
                <Bar dataKey="total" fill="var(--analyze-1)" radius={[2, 2, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 50, bottom: 30 }}
            >
              <CartesianGrid strokeOpacity={0.3} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value === 0) return "";
                  return `${Math.floor(value / 60)}h`;
                }}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-background rounded-lg border p-3 shadow-lg">
                      <p className="mb-1 font-medium">{label}</p>
                      <p className="text-sm">
                        {formatTime(payload[0]?.value as number || 0)}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--analyze-1)"
                fill="url(#storyGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="storyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--analyze-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--analyze-1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ChartContainer>
      </motion.div>

      {/* Story Insights */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center p-3 bg-gradient-to-b from-analyze-1/10 to-transparent rounded-lg">
          <div className="text-2xl font-bold font-mono text-analyze-1">
            {formatTime(insights.totalTime)}
          </div>
          <div className="text-xs text-muted-foreground">Total Focus</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-b from-analyze-2/10 to-transparent rounded-lg">
          <div className="text-2xl font-bold font-mono text-analyze-2">
            {formatTime(Math.round(insights.avgDaily))}
          </div>
          <div className="text-xs text-muted-foreground">Daily Average</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-b from-analyze-3/10 to-transparent rounded-lg">
          <div className="text-2xl font-bold font-mono text-analyze-3">
            {insights.streak}
          </div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-b from-analyze-4/10 to-transparent rounded-lg">
          <div className="text-2xl font-bold font-mono text-analyze-4">
            {Math.round(insights.consistency * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Consistency</div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper functions for insights
function calculateStreak(data: Array<{ total: number }>): number {
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].total > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateMomentum(data: Array<{ total: number }>): number {
  if (data.length < 2) return 0;
  const recent = data.slice(-3);
  const earlier = data.slice(-6, -3);
  const recentAvg = recent.reduce((sum, d) => sum + d.total, 0) / recent.length;
  const earlierAvg = earlier.reduce((sum, d) => sum + d.total, 0) / Math.max(earlier.length, 1);
  return earlierAvg > 0 ? (recentAvg - earlierAvg) / earlierAvg : 0;
}

function calculateConsistency(data: Array<{ total: number }>): number {
  if (data.length === 0) return 0;
  const workingDays = data.filter(d => d.total > 0).length;
  return workingDays / data.length;
}