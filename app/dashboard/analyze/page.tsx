"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useAnalyticsData } from "../shared/hooks/use-dashboard-data";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  getTodayStart,
  getYesterdayStart,
  getCustomDateString,
} from "../shared/utils/day-utils";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../../../components/ui/chart";

interface TimeEntry {
  taskTitle: string;
  taskTopic?: string;
  duration: number;
  startedAt: number;
}

interface GroupedEntries {
  total: number;
  entries: TimeEntry[];
}

type TimePeriod = "today" | "yesterday" | "week" | "month";

interface DayData {
  date: string;
  topics: { topic: string; time: number; color: string }[];
  total: number;
}

interface WeekBarChartProps {
  data: DayData[];
  formatTime: (minutes: number) => string;
  formatDate: (dateString: string) => string;
}

function WeekBarChart({ data, formatTime, formatDate }: WeekBarChartProps) {
  // Get all unique topics for stacking
  const allTopics = Array.from(
    new Set(data.flatMap(day => day.topics.map(topic => topic.topic)))
  );

  // If no topics, show total bars with single color
  const hasTopics = allTopics.length > 0;

  // Transform data for recharts
  const chartData = data.map(day => {
    const chartEntry: Record<string, string | number> = {
      day: formatDate(day.date),
      dayFull: day.date,
      total: day.total
    };
    
    if (hasTopics) {
      // Add each topic as a separate data key
      day.topics.forEach(topic => {
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
        color: `var(--analyze-${analyzeColorIndex})`
      };
    });
  } else {
    chartConfig['total'] = {
      label: 'Total Time',
      color: 'var(--analyze-1)'
    };
  }


  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 50,
            bottom: 30,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value === 0) return '';
              const h = Math.floor(value / 60);
              const m = value % 60;
              if (h && m) return `${h}h ${m}m`;
              if (h) return `${h}h`;
              if (m) return `${m}m`;
              return '';
            }}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            width={50}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              
              const data = payload[0]?.payload;
              if (!data) return null;
              
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <p className="font-medium mb-2">{label}</p>
                  <div className="space-y-1">
                    {allTopics.map((topic) => {
                      const value = data[topic];
                      if (!value) return null;
                      return (
                        <div key={topic} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: chartConfig[topic]?.color }}
                          />
                          <span>{topic}: {formatTime(value)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-1 mt-2">
                      <span className="font-medium text-sm">Total: {formatTime(data.total)}</span>
                    </div>
                  </div>
                </div>
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
                  radius={0}
                />
              );
            })
          ) : (
            <Bar
              dataKey="total"
              fill="var(--analyze-1)"
              radius={0}
            />
          )}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default function AnalyzePage() {
  const rawTimeEntries = useAnalyticsData();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const userSettings = useQuery(api.users.getUserSettings);

  const timeEntries = useMemo(() => {
    return (rawTimeEntries as Record<string, GroupedEntries>) ?? {};
  }, [rawTimeEntries]);

  // Generate consistent colors for topics using custom analyze colors
  const getTopicColor = (topic: string): string => {
    const colors = [
      "bg-analyze-1",
      "bg-analyze-2", 
      "bg-analyze-3",
      "bg-analyze-4",
      "bg-analyze-5",
    ];

    // Simple hash function to consistently assign colors
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
      hash = topic.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredData = useMemo(() => {
    const entries = Object.values(timeEntries).flatMap((item) => item.entries);

    if (entries.length === 0 || !userSettings) return [];

    const dayStartHour = userSettings.dayStartHour;
    let startTimestamp: number;
    let endTimestamp: number;

    switch (selectedPeriod) {
      case "today":
        startTimestamp = getTodayStart(dayStartHour);
        endTimestamp = startTimestamp + 24 * 60 * 60 * 1000;
        break;
      case "yesterday":
        startTimestamp = getYesterdayStart(dayStartHour);
        endTimestamp = startTimestamp + 24 * 60 * 60 * 1000;
        break;
      case "week": {
        // Find the start of the current week (Sunday)
        const today = new Date(getTodayStart(dayStartHour));
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - dayOfWeek);
        sunday.setHours(dayStartHour, 0, 0, 0);
        startTimestamp = sunday.getTime();
        endTimestamp = startTimestamp + 7 * 24 * 60 * 60 * 1000;
        break;
      }
      case "month":
        startTimestamp = getTodayStart(dayStartHour) - 30 * 24 * 60 * 60 * 1000;
        endTimestamp = getTodayStart(dayStartHour) + 24 * 60 * 60 * 1000;
        break;
      default:
        const today = new Date(getTodayStart(dayStartHour));
        const dayOfWeek = today.getDay();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - dayOfWeek);
        sunday.setHours(dayStartHour, 0, 0, 0);
        startTimestamp = sunday.getTime();
        endTimestamp = startTimestamp + 7 * 24 * 60 * 60 * 1000;
    }

    const filteredEntries = entries.filter(
      (entry) => entry.startedAt >= startTimestamp && (selectedPeriod !== "week" || entry.startedAt < endTimestamp),
    );

    // Group by day and topic
    const dayMap = new Map<string, Map<string, number>>();

    // For week view, ensure we have all 7 days even if no data
    if (selectedPeriod === "week") {
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startTimestamp + i * 24 * 60 * 60 * 1000);
        const dateString = dayDate.toDateString();
        dayMap.set(dateString, new Map());
      }
    }

    filteredEntries.forEach((entry) => {
      const date = getCustomDateString(entry.startedAt, dayStartHour);
      const topic = entry.taskTopic || "Uncategorized";

      if (!dayMap.has(date)) {
        dayMap.set(date, new Map());
      }

      const topicMap = dayMap.get(date)!;
      topicMap.set(topic, (topicMap.get(topic) || 0) + entry.duration);
    });

    // Convert to array format
    const result: DayData[] = [];
    const sortedDates = Array.from(dayMap.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    sortedDates.forEach((date) => {
      const topicMap = dayMap.get(date)!;
      const topics = Array.from(topicMap.entries()).map(([topic, time]) => ({
        topic,
        time,
        color: getTopicColor(topic),
      }));

      const total = topics.reduce((sum, t) => sum + t.time, 0);

      result.push({
        date,
        topics: topics.sort((a, b) => b.time - a.time),
        total,
      });
    });

    return result;
  }, [timeEntries, selectedPeriod, userSettings]);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDate = (dateString: string) => {
    if (!userSettings) return dateString;

    const date = new Date(dateString);
    const dayStartHour = userSettings.dayStartHour;
    const todayStart = getTodayStart(dayStartHour);
    const yesterdayStart = getYesterdayStart(dayStartHour);

    const todayDateString = new Date(todayStart).toDateString();
    const yesterdayDateString = new Date(yesterdayStart).toDateString();

    if (dateString === todayDateString) return "Today";
    if (dateString === yesterdayDateString) return "Yesterday";

    // For week view, show day name prominently
    if (selectedPeriod === "week") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
      });
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const maxTime = Math.max(...filteredData.map((day) => day.total), 1);


  const periodLabels = {
    today: "Today",
    yesterday: "Yesterday",
    week: "This Week",
    month: "This Month",
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      {/* Time Visualization */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-light">
              Time Spent by Topic - {periodLabels[selectedPeriod]}
            </h3>
            <div className="flex items-center gap-2">
              {Object.entries(periodLabels).map(([period, label]) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period as TimePeriod)}
                  className="h-8 px-3 text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No time entries found for this period. Start tracking your time to
              see analytics here.
            </div>
          ) : selectedPeriod === "week" ? (
            <WeekBarChart 
              data={filteredData} 
              formatTime={formatTime} 
              formatDate={formatDate}
            />
          ) : (
            <div className="space-y-4">
              {filteredData.map((day) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">
                      {formatDate(day.date)}
                    </span>
                    <span className="text-sm font-semibold">
                      {formatTime(day.total)}
                    </span>
                  </div>

                  {/* Topic Bar */}
                  <div className="w-full overflow-hidden rounded-lg bg-muted h-12">
                    <div className="flex h-full">
                      {day.total > 0 ? (
                        day.topics.length > 0 ? day.topics.map((topic, index) => (
                          <div
                            key={`${topic.topic}-${index}`}
                            className={`group relative flex items-center justify-center ${topic.color}`}
                            style={{
                              width: `${(topic.time / maxTime) * 100}%`, 
                              minWidth: topic.time > 0 ? "2px" : "0px"
                            }}
                            title={`${topic.topic}: ${formatTime(topic.time)}`}
                          >
                            {/* Tooltip */}
                            <div className="absolute left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-foreground px-2 py-1 text-xs text-background group-hover:block z-10 whitespace-nowrap">
                              {topic.topic}: {formatTime(topic.time)}
                            </div>
                          </div>
                        )) : (
                          // Show a single bar for uncategorized time
                          <div
                            className={`group relative flex items-center justify-center w-full h-full ${getTopicColor("Uncategorized")}`}
                            title={`Uncategorized: ${formatTime(day.total)}`}
                          >
                            <div className="absolute left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-foreground px-2 py-1 text-xs text-background group-hover:block z-10 whitespace-nowrap">
                              Uncategorized: {formatTime(day.total)}
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                          No activity
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Topic Legend */}
                  {day.total > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {day.topics.length > 0 ? day.topics.map((topic, index) => (
                        <div
                          key={`legend-${topic.topic}-${index}`}
                          className="flex items-center gap-1"
                        >
                          <div className={`h-3 w-3 rounded-full ${topic.color}`} />
                          <span className="text-xs text-muted-foreground">
                            {topic.topic} ({formatTime(topic.time)})
                          </span>
                        </div>
                      )) : (
                        <div className="flex items-center gap-1">
                          <div className={`h-3 w-3 rounded-full ${getTopicColor("Uncategorized")}`} />
                          <span className="text-xs text-muted-foreground">
                            Uncategorized ({formatTime(day.total)})
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
