"use client";

import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Award, Zap, Target } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../../../components/ui/chart";
import { type DayData } from "../_hooks/use-analyze-data";

interface WeekBarChartProps {
  data: DayData[];
  formatTime: (minutes: number) => string;
  formatDate: (dateString: string) => string;
}

export function WeekBarChart({ data, formatTime, formatDate }: WeekBarChartProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  // Get all unique topics for stacking
  const allTopics = Array.from(
    new Set(data.flatMap((day) => day.topics.map((topic) => topic.topic))),
  );
  
  // Calculate insights
  const totalWeekTime = data.reduce((sum, day) => sum + day.total, 0);
  const averageDaily = totalWeekTime / data.length;
  const bestDay = data.reduce((best, day) => day.total > best.total ? day : best, data[0]);
  const mostProductiveTopic = allTopics.length > 0 ? 
    allTopics.reduce((best, topic) => {
      const topicTotal = data.reduce((sum, day) => {
        const topicTime = day.topics.find(t => t.topic === topic)?.time || 0;
        return sum + topicTime;
      }, 0);
      const bestTotal = data.reduce((sum, day) => {
        const bestTopicTime = day.topics.find(t => t.topic === best)?.time || 0;
        return sum + bestTopicTime;
      }, 0);
      return topicTotal > bestTotal ? topic : best;
    }) : null;

  // If no topics, show total bars with single color
  const hasTopics = allTopics.length > 0;

  // Transform data for recharts
  const chartData = data.map((day) => {
    const chartEntry: Record<string, string | number> = {
      day: formatDate(day.date),
      dayFull: day.date,
      total: day.total,
    };

    if (hasTopics) {
      // Add each topic as a separate data key
      day.topics.forEach((topic) => {
        chartEntry[topic.topic] = topic.time;
      });
    }

    return chartEntry;
  });

  // Create chart config with analyze theme colors
  const chartConfig: ChartConfig = {};

  if (hasTopics) {
    allTopics.forEach((topic, index) => {
      const analyzeColorIndex = (index % 5) + 1;
      chartConfig[topic] = {
        label: topic,
        color: `var(--analyze-${analyzeColorIndex})`,
      };
    });
  } else {
    chartConfig["total"] = {
      label: "Total Time",
      color: "var(--analyze-1)",
    };
  }

  // Get encouraging message for the week
  const getWeekInsight = () => {
    if (totalWeekTime >= 1260) return { // 21+ hours
      text: "Exceptional week! You're absolutely crushing it!",
      icon: Award,
      color: "text-analyze-1"
    };
    if (totalWeekTime >= 840) return { // 14+ hours  
      text: "Strong week! Consistent effort pays off.",
      icon: TrendingUp,
      color: "text-analyze-2"
    };
    if (totalWeekTime >= 420) return { // 7+ hours
      text: "Good momentum this week!",
      icon: Zap,
      color: "text-analyze-3"
    };
    if (totalWeekTime > 0) return {
      text: "Every minute of progress counts!",
      icon: Target,
      color: "text-analyze-4"
    };
    return {
      text: "Ready to make this week amazing?",
      icon: Target,
      color: "text-analyze-5"
    };
  };
  
  const weekInsight = getWeekInsight();
  const InsightIcon = weekInsight.icon;
  
  return (
    <motion.div 
      className="h-80 w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setShowInsights(true)}
      onHoverEnd={() => setShowInsights(false)}
    >
      {/* Week insights overlay */}
      <AnimatePresence>
        {showInsights && totalWeekTime > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg"
          >
            <div className="flex items-center justify-between text-sm">
              <div className={`flex items-center gap-2 ${weekInsight.color} font-medium`}>
                <InsightIcon className="h-4 w-4" />
                {weekInsight.text}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Week total: <span className="font-mono font-medium">{formatTime(totalWeekTime)}</span></div>
                <div>Daily avg: <span className="font-mono font-medium">{formatTime(Math.round(averageDaily))}</span></div>
                {bestDay && <div>Best day: <span className="font-medium">{formatDate(bestDay.date)}</span></div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: showInsights ? 60 : 10,
            right: 10,
            left: 50,
            bottom: 30,
          }}
          onMouseEnter={(data) => {
            if (data && data.activeLabel) {
              setHoveredDay(data.activeLabel);
            }
          }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          <CartesianGrid vertical={false} />
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background rounded-lg border p-4 shadow-lg backdrop-blur-sm"
                >
                  <motion.p 
                    className="mb-3 font-bold text-base bg-gradient-to-r from-analyze-1 to-analyze-2 bg-clip-text text-transparent"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                  >
                    {label}
                  </motion.p>
                  <div className="space-y-2">
                    {allTopics.map((topic, index) => {
                      const value = data[topic];
                      if (!value) return null;
                      return (
                        <motion.div
                          key={topic}
                          className="flex items-center gap-3 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <motion.div
                            className="h-3 w-3 rounded-full shadow-sm"
                            style={{
                              backgroundColor: chartConfig[topic]?.color,
                            }}
                            whileHover={{ scale: 1.3 }}
                          />
                          <span className="flex-1">
                            {topic}: <span className="font-mono font-medium">{formatTime(value)}</span>
                          </span>
                        </motion.div>
                      );
                    })}
                    <motion.div 
                      className="mt-3 pt-2 border-t border-analyze-2/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-sm font-bold flex items-center gap-2">
                        <Target className="h-3 w-3 text-analyze-1" />
                        Total: <span className="font-mono">{formatTime(data.total)}</span>
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            }}
          />
          {hasTopics ? (
            allTopics.map((topic, index) => {
              const analyzeColorIndex = (index % 5) + 1;
              return (
                <Bar
                  key={topic}
                  dataKey={topic}
                  stackId="topics"
                  fill={`var(--analyze-${analyzeColorIndex})`}
                  radius={index === allTopics.length - 1 ? [2, 2, 0, 0] : 0}
                  style={{
                    filter: hoveredDay ? 'brightness(1.1)' : 'brightness(1)',
                    transition: 'filter 0.2s ease'
                  }}
                />
              );
            })
          ) : (
            <Bar 
              dataKey="total" 
              fill="var(--analyze-1)" 
              radius={[4, 4, 0, 0]}
              style={{
                filter: hoveredDay ? 'brightness(1.1)' : 'brightness(1)',
                transition: 'filter 0.2s ease'
              }}
            />
          )}
        </BarChart>
      </ChartContainer>
      </motion.div>
      
      {/* Fun data insights */}
      {totalWeekTime > 0 && (
        <motion.div 
          className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-analyze-1" />
            <span>Best: <span className="font-mono">{formatTime(bestDay?.total || 0)}</span></span>
          </div>
          {mostProductiveTopic && (
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-analyze-2" />
              <span>Top focus: <span className="font-medium">{mostProductiveTopic}</span></span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-analyze-3" />
            <span>Weekly: <span className="font-mono">{formatTime(totalWeekTime)}</span></span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}