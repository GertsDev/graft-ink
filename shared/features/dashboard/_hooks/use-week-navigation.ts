import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export interface UseWeekNavigationReturn {
  weekData: any;
  isLoading: boolean;
  weekOffset: number;
  navigateToWeek: (offset: number) => void;
  navigateToPreviousWeek: () => void;
  navigateToNextWeek: () => void;
  canNavigateNext: boolean;
}

export function useWeekNavigation(dayStartHour: number = 6): UseWeekNavigationReturn {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week

  const weekData = useQuery(
    api.analytics.getWeekAnalytics,
    {
      weekOffset,
      dayStartHour,
    }
  );

  const navigateToWeek = (offset: number) => {
    setWeekOffset(offset);
  };

  const navigateToPreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const navigateToNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const canNavigateNext = useMemo(() => {
    return weekOffset < 0; // Can only navigate forward if we're in the past
  }, [weekOffset]);

  return {
    weekData,
    isLoading: weekData === undefined,
    weekOffset,
    navigateToWeek,
    navigateToPreviousWeek,
    navigateToNextWeek,
    canNavigateNext,
  };
}