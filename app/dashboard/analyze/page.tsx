"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { useAnalyticsData } from "../shared/hooks/use-dashboard-data";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  getTodayStart,
  getYesterdayStart,
  getCustomDateString,
} from "../shared/utils/day-utils";

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

export default function AnalyzePage() {
  const rawTimeEntries = useAnalyticsData();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const userSettings = useQuery(api.users.getUserSettings);

  const timeEntries = useMemo(() => {
    return (rawTimeEntries as Record<string, GroupedEntries>) ?? {};
  }, [rawTimeEntries]);

  // Generate consistent colors for topics
  const getTopicColor = (topic: string): string => {
    const colors = ["#534439", "#baa89b", "#00ad91", "#00765f"];

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

    switch (selectedPeriod) {
      case "today":
        startTimestamp = getTodayStart(dayStartHour);
        break;
      case "yesterday":
        startTimestamp = getYesterdayStart(dayStartHour);
        break;
      case "week":
        startTimestamp = getTodayStart(dayStartHour) - 7 * 24 * 60 * 60 * 1000;
        break;
      case "month":
        startTimestamp = getTodayStart(dayStartHour) - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        startTimestamp = getTodayStart(dayStartHour) - 7 * 24 * 60 * 60 * 1000;
    }

    const filteredEntries = entries.filter(
      (entry) => entry.startedAt >= startTimestamp,
    );

    // Group by day and topic
    const dayMap = new Map<string, Map<string, number>>();

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
      {/* Time Period Selection */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Time Analysis</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(periodLabels).map(([period, label]) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as TimePeriod)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Visualization */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Time Spent by Topic - {periodLabels[selectedPeriod]}
          </h3>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No time entries found for this period. Start tracking your time to
              see analytics here.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((day) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {formatDate(day.date)}
                    </span>
                    <span className="text-sm font-semibold">
                      {formatTime(day.total)}
                    </span>
                  </div>

                  {/* Topic Bar */}
                  <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-200">
                    <div className="flex h-full">
                      {day.topics.map((topic, index) => (
                        <div
                          key={`${topic.topic}-${index}`}
                          className="group relative flex items-center justify-center"
                          style={{
                            backgroundColor: topic.color,
                            width: `${(topic.time / maxTime) * 100}%`,
                            minWidth: topic.time > 0 ? "2px" : "0px",
                          }}
                          title={`${topic.topic}: ${formatTime(topic.time)}`}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                            {topic.topic}: {formatTime(topic.time)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topic Legend */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {day.topics.map((topic, index) => (
                      <div
                        key={`legend-${topic.topic}-${index}`}
                        className="flex items-center gap-1"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: topic.color }}
                        />
                        <span className="text-xs text-gray-600">
                          {topic.topic} ({formatTime(topic.time)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
