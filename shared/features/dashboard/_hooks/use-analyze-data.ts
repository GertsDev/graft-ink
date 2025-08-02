import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAnalyticsData } from "./use-dashboard-data";
import {
  getTodayStart,
  getYesterdayStart,
  getCustomDateString,
} from "../_utils/day-utils";

export interface TimeEntry {
  taskTitle: string;
  taskTopic?: string;
  duration: number;
  startedAt: number;
}

export interface GroupedEntries {
  total: number;
  entries: TimeEntry[];
}

export type TimePeriod = "today" | "yesterday" | "week" | "month";

export interface DayData {
  date: string;
  topics: { topic: string; time: number; color: string }[];
  total: number;
}

export interface UseAnalyzeDataReturn {
  filteredData: DayData[];
  maxTime: number;
  isLoading: boolean;
}

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

export function useAnalyzeData(
  selectedPeriod: TimePeriod,
): UseAnalyzeDataReturn {
  const rawTimeEntries = useAnalyticsData();
  const userSettings = useQuery(api.users.getUserSettings);

  const timeEntries = useMemo(() => {
    return (rawTimeEntries as Record<string, GroupedEntries>) ?? {};
  }, [rawTimeEntries]);

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
      (entry) =>
        entry.startedAt >= startTimestamp &&
        (selectedPeriod !== "week" || entry.startedAt < endTimestamp),
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

  const maxTime = useMemo(() => {
    return Math.max(...filteredData.map((day) => day.total), 1);
  }, [filteredData]);

  const isLoading = !userSettings || rawTimeEntries === undefined;

  return {
    filteredData,
    maxTime,
    isLoading,
  };
}

export { getTopicColor };
