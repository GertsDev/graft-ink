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
