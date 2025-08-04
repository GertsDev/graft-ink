import { getTodayStart, getYesterdayStart } from "./day-utils";
import type { TimePeriod } from "../_hooks/use-analyze-data";

export const formatTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatDate = (
  dateString: string,
  selectedPeriod: TimePeriod,
  dayStartHour: number,
): string => {
  const date = new Date(dateString);
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

export const PERIOD_LABELS: Record<TimePeriod, string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This Week",
  month: "This Month",
};

export const formatMonthYear = (year: number, month: number): string => {
  const date = new Date(year, month);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const formatWeekRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  } else {
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
  }
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatGrowth = (growth: number): string => {
  const sign = growth > 0 ? "+" : "";
  return `${sign}${growth.toFixed(1)}%`;
};
