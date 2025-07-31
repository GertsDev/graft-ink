"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useMemo } from "react";

export function useDashboardData() {
  // Calculate today start once
  const todayStart = useMemo(() => new Date().setHours(0, 0, 0, 0), []);

  // Single query for all dashboard data
  const data = useQuery(api.dashboard.getDashboardData, { todayStart });

  return {
    tasks: data?.tasks ?? [],
    timeEntries: data?.timeEntries ?? {},
    totalToday: data?.totalToday ?? 0,
    isLoading: data === undefined,
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
