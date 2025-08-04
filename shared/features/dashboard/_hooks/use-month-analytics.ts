import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export interface UseMonthAnalyticsReturn {
  monthData: any;
  isLoading: boolean;
  currentMonth: number;
  currentYear: number;
  navigateToMonth: (year: number, month: number) => void;
  navigateToPreviousMonth: () => void;
  navigateToNextMonth: () => void;
  canNavigateNext: boolean;
}

export function useMonthAnalytics(dayStartHour: number = 6): UseMonthAnalyticsReturn {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(), // 0-based
    };
  });

  const monthData = useQuery(
    api.analytics.getMonthAnalytics,
    {
      year: currentDate.year,
      month: currentDate.month,
      dayStartHour,
    }
  );

  const navigateToMonth = (year: number, month: number) => {
    setCurrentDate({ year, month });
  };

  const navigateToPreviousMonth = () => {
    const newDate = new Date(currentDate.year, currentDate.month - 1);
    setCurrentDate({
      year: newDate.getFullYear(),
      month: newDate.getMonth(),
    });
  };

  const navigateToNextMonth = () => {
    const newDate = new Date(currentDate.year, currentDate.month + 1);
    setCurrentDate({
      year: newDate.getFullYear(),
      month: newDate.getMonth(),
    });
  };

  const canNavigateNext = useMemo(() => {
    const now = new Date();
    const currentMonthStart = new Date(currentDate.year, currentDate.month);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth());
    return currentMonthStart < thisMonthStart;
  }, [currentDate]);

  return {
    monthData,
    isLoading: monthData === undefined,
    currentMonth: currentDate.month,
    currentYear: currentDate.year,
    navigateToMonth,
    navigateToPreviousMonth,
    navigateToNextMonth,
    canNavigateNext,
  };
}