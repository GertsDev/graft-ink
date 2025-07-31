/**
 * Utility functions for handling custom day boundaries based on user settings
 */

/**
 * Calculate the start of "today" based on custom day start hour
 */
export function getTodayStart(dayStartHour: number): number {
  const now = new Date();
  
  // Create date for user's day start time today
  const todayDayStart = new Date();
  todayDayStart.setHours(dayStartHour, 0, 0, 0);
  
  // If current time is before the day start hour, 
  // then "today" actually started yesterday at the day start hour
  if (now < todayDayStart) {
    todayDayStart.setDate(todayDayStart.getDate() - 1);
  }
  
  return todayDayStart.getTime();
}

/**
 * Get the start of "yesterday" based on custom day start hour
 */
export function getYesterdayStart(dayStartHour: number): number {
  const todayStart = getTodayStart(dayStartHour);
  return todayStart - 24 * 60 * 60 * 1000; // 24 hours earlier
}

/**
 * Get start of a specific date with custom day start hour
 */
export function getDateStart(date: Date, dayStartHour: number): number {
  const dayStart = new Date(date);
  dayStart.setHours(dayStartHour, 0, 0, 0);
  return dayStart.getTime();
}

/**
 * Check if a timestamp falls within a custom day boundary
 */
export function isWithinCustomDay(timestamp: number, dayStart: number): boolean {
  return timestamp >= dayStart && timestamp < dayStart + 24 * 60 * 60 * 1000;
}

/**
 * Format timestamp to date string using custom day boundaries
 * This ensures that times after the custom day start are grouped correctly
 */
export function getCustomDateString(timestamp: number, dayStartHour: number): string {
  const date = new Date(timestamp);
  
  // If the time is before the day start hour, it belongs to the previous day
  if (date.getHours() < dayStartHour) {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    return adjustedDate.toDateString();
  }
  
  return date.toDateString();
}