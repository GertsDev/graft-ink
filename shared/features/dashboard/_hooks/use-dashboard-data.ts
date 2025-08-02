"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useMemo } from "react";
import { getTodayStart } from "../_utils/day-utils";

export function useDashboardData() {
  // Get user settings to determine when their day starts
  const userSettings = useQuery(api.users.getUserSettings);

  // Calculate today start based on user's day start hour
  const todayStart = useMemo(() => {
    if (userSettings === undefined) return 0; // Loading state
    return getTodayStart(userSettings.dayStartHour);
  }, [userSettings]);

  // Single query for all dashboard data - refetches automatically when todayStart changes
  const data = useQuery(
    api.dashboard.getDashboardData,
    userSettings !== undefined ? { todayStart } : "skip",
  );

  return {
    tasks: data?.tasks ?? [],
    timeEntries: data?.timeEntries ?? {},
    totalToday: data?.totalToday ?? 0,
    isLoading: data === undefined || userSettings === undefined,
  };
}

// Analytics-specific hook
export function useAnalyticsData() {
  const { timeEntries } = useDashboardData();

  return useMemo(() => {
    // Convert to format expected by analytics component
    return timeEntries;
  }, [timeEntries]);
}
