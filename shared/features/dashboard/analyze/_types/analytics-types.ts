// Centralized type definitions for analytics components

// Base analytics interfaces
export interface MonthStats {
  totalMinutes: number;
  totalTasks: number;
  totalDays: number;
  averagePerDay: number;
  longestStreak: number;
  consistency: number;
}

export interface WeekStats {
  totalMinutes: number;
  totalTasks: number;
  activeDays: number;
  averagePerDay: number;
  consistency: number;
}

export interface WeekInfo {
  startDate: string;
  endDate: string;
  weekNumber: number;
  year: number;
}

// Data breakdown interfaces
export interface DailyBreakdownItem {
  date: string;
  totalMinutes: number;
  tasksCount: number;
  topics: Record<string, number>;
}

export interface DailyDataItem {
  date: string;
  dayName: string;
  totalMinutes: number;
  tasksCount: number;
  topics: Record<string, number>;
}

export interface TopicSummaryItem {
  totalMinutes: number;
  taskCount: number;
  percentage: number;
}

export interface TopicBreakdownItem {
  totalMinutes: number;
  percentage: number;
  taskCount?: number;
}

export interface WeeklyComparisonItem {
  weekStart: string;
  totalMinutes: number;
  growth: number;
}

export interface WeekComparison {
  previousWeek: number;
  growth: number;
}

// Milestone interface
export interface Milestone {
  _id: string;
  type: string;
  value: number;
  achievedAt: number;
  taskTitle?: string;
}

// Composite data structures
export interface MonthAnalyticsData {
  monthStats: MonthStats;
  dailyBreakdown: DailyBreakdownItem[];
  topicSummary: Record<string, TopicSummaryItem>;
  weeklyComparison: WeeklyComparisonItem[];
  milestones: Milestone[];
}

export interface WeekAnalyticsData {
  weekInfo: WeekInfo;
  weekStats: WeekStats;
  dailyData: DailyDataItem[];
  topicBreakdown: Record<string, TopicBreakdownItem>;
  comparison: WeekComparison;
}

// Chart-specific interfaces
export interface TopicDataPoint {
  topic: string;
  time: number;
  color: string;
}

export interface DayData {
  date: string;
  topics: TopicDataPoint[];
  total: number;
}

export interface ChartInsight {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Time period enum
export type TimePeriod = "today" | "yesterday" | "week" | "month";