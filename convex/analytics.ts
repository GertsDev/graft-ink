import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to sanitize strings for use as object keys
function sanitizeKey(str: string): string {
  return str
    .replace(/[^\x20-\x7E]/g, '_') // Replace non-printable ASCII with underscore
    .replace(/[/\\]/g, '_') // Replace slashes that could cause issues
    .substring(0, 50); // Limit length
}

// Helper function to get month boundaries
function getMonthBoundaries(year: number, month: number, dayStartHour: number = 6) {
  const start = new Date(year, month, 1);
  start.setHours(dayStartHour, 0, 0, 0);
  
  const end = new Date(year, month + 1, 1);
  end.setHours(dayStartHour, 0, 0, 0);
  
  return {
    start: start.getTime(),
    end: end.getTime()
  };
}

// Helper function to get week boundaries
function getWeekBoundaries(weekOffset: number = 0, dayStartHour: number = 6) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  today.setHours(dayStartHour, 0, 0, 0);
  
  // Find Sunday of current week
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));
  
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 7);
  
  return {
    start: sunday.getTime(),
    end: saturday.getTime()
  };
}

// Month analytics query
export const getMonthAnalytics = query({
  args: { 
    year: v.number(), 
    month: v.number(), // 0-based (0 = January)
    dayStartHour: v.optional(v.number())
  },
  returns: v.object({
    monthStats: v.object({
      totalMinutes: v.number(),
      totalTasks: v.number(),
      totalDays: v.number(),
      averagePerDay: v.number(),
      longestStreak: v.number(),
      consistency: v.number(),
    }),
    dailyBreakdown: v.array(v.object({
      date: v.string(),
      totalMinutes: v.number(),
      tasksCount: v.number(),
      topics: v.record(v.string(), v.number()),
    })),
    topicSummary: v.record(v.string(), v.object({
      totalMinutes: v.number(),
      taskCount: v.number(),
      percentage: v.number(),
    })),
    weeklyComparison: v.array(v.object({
      weekStart: v.string(),
      totalMinutes: v.number(),
      growth: v.number(),
    })),
    milestones: v.array(v.object({
      _id: v.id("milestones"),
      type: v.string(),
      value: v.number(),
      achievedAt: v.number(),
      taskTitle: v.optional(v.string()),
    })),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        monthStats: { totalMinutes: 0, totalTasks: 0, totalDays: 0, averagePerDay: 0, longestStreak: 0, consistency: 0 },
        dailyBreakdown: [],
        topicSummary: {},
        weeklyComparison: [],
        milestones: [],
      };
    }

    const dayStartHour = args.dayStartHour ?? 6;
    const { start: monthStart, end: monthEnd } = getMonthBoundaries(args.year, args.month, dayStartHour);

    // Get all entries for the month
    const monthEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", userId)
         .gte("startedAt", monthStart)
         .lt("startedAt", monthEnd)
      )
      .collect();

    // Get milestones for the month
    const monthMilestones = await ctx.db
      .query("milestones")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId)
         .gte("achievedAt", monthStart)
         .lt("achievedAt", monthEnd)
      )
      .collect();

    // Calculate daily breakdown
    const dailyMap = new Map<string, { totalMinutes: number; tasksCount: number; topics: Map<string, number> }>();
    
    // Initialize all days of the month
    const daysInMonth = new Date(args.year, args.month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(args.year, args.month, day).toISOString().split('T')[0];
      dailyMap.set(date, { totalMinutes: 0, tasksCount: 0, topics: new Map() });
    }

    // Process entries
    const taskIds = new Set<string>();
    const topicTotals = new Map<string, { minutes: number; tasks: Set<string> }>();
    
    monthEntries.forEach(entry => {
      const date = new Date(entry.startedAt);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = dailyMap.get(dateStr);
      if (dayData) {
        dayData.totalMinutes += entry.duration;
        taskIds.add(entry.taskId);
        
        const topic = sanitizeKey(entry.taskTopic || "Uncategorized");
        dayData.topics.set(topic, (dayData.topics.get(topic) || 0) + entry.duration);
        
        // Track unique tasks per day
        const taskKey = `${dateStr}-${entry.taskId}`;
        if (!dayData.hasOwnProperty(taskKey)) {
          dayData.tasksCount++;
          (dayData as any)[taskKey] = true;
        }
        
        // Update topic summary
        if (!topicTotals.has(topic)) {
          topicTotals.set(topic, { minutes: 0, tasks: new Set() });
        }
        const topicData = topicTotals.get(topic)!;
        topicData.minutes += entry.duration;
        topicData.tasks.add(entry.taskId);
      }
    });

    // Calculate stats
    const totalMinutes = monthEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const totalTasks = taskIds.size;
    const activeDays = Array.from(dailyMap.values()).filter(day => day.totalMinutes > 0).length;
    const averagePerDay = activeDays > 0 ? totalMinutes / activeDays : 0;

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 0;
    Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([_, dayData]) => {
        if (dayData.totalMinutes > 0) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

    // Calculate consistency (percentage of days with activity)
    const consistency = daysInMonth > 0 ? (activeDays / daysInMonth) * 100 : 0;

    // Prepare daily breakdown
    const dailyBreakdown = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        totalMinutes: data.totalMinutes,
        tasksCount: data.tasksCount,
        topics: Object.fromEntries(
          Array.from(data.topics.entries()).map(([topic, minutes]) => [topic, minutes])
        ),
      }));

    // Prepare topic summary
    const topicSummary = Object.fromEntries(
      Array.from(topicTotals.entries()).map(([topic, data]) => [
        topic,
        {
          totalMinutes: data.minutes,
          taskCount: data.tasks.size,
          percentage: totalMinutes > 0 ? (data.minutes / totalMinutes) * 100 : 0,
        }
      ])
    );

    // Calculate weekly comparison
    const weeklyComparison = [];
    for (let weekOffset = 0; weekOffset < 5; weekOffset++) {
      const weekStart = new Date(args.year, args.month, 1 + (weekOffset * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      if (weekStart.getMonth() !== args.month && weekOffset > 0) break;
      
      const weekEntries = monthEntries.filter(entry => {
        const entryDate = new Date(entry.startedAt);
        return entryDate >= weekStart && entryDate < weekEnd;
      });
      
      const weekMinutes = weekEntries.reduce((sum, entry) => sum + entry.duration, 0);
      const prevWeekMinutes: number = weekOffset > 0 ? weeklyComparison[weekOffset - 1]?.totalMinutes || 0 : 0;
      const growth = prevWeekMinutes > 0 ? ((weekMinutes - prevWeekMinutes) / prevWeekMinutes) * 100 : 0;
      
      weeklyComparison.push({
        weekStart: weekStart.toISOString().split('T')[0],
        totalMinutes: weekMinutes,
        growth,
      });
    }

    // Format milestones
    const milestones = monthMilestones.map(milestone => ({
      _id: milestone._id,
      type: milestone.type,
      value: milestone.value,
      achievedAt: milestone.achievedAt,
      taskTitle: milestone.metadata?.taskTitle,
    }));

    return {
      monthStats: {
        totalMinutes,
        totalTasks,
        totalDays: activeDays,
        averagePerDay,
        longestStreak,
        consistency,
      },
      dailyBreakdown,
      topicSummary,
      weeklyComparison,
      milestones,
    };
  },
});

// Enhanced week analytics with navigation support
export const getWeekAnalytics = query({
  args: { 
    weekOffset: v.optional(v.number()), // 0 = current week, -1 = previous, +1 = next
    dayStartHour: v.optional(v.number())
  },
  returns: v.object({
    weekInfo: v.object({
      startDate: v.string(),
      endDate: v.string(),
      weekNumber: v.number(),
      year: v.number(),
    }),
    weekStats: v.object({
      totalMinutes: v.number(),
      totalTasks: v.number(),
      activeDays: v.number(),
      averagePerDay: v.number(),
      consistency: v.number(),
    }),
    dailyData: v.array(v.object({
      date: v.string(),
      dayName: v.string(),
      totalMinutes: v.number(),
      tasksCount: v.number(),
      topics: v.record(v.string(), v.number()),
    })),
    topicBreakdown: v.record(v.string(), v.object({
      totalMinutes: v.number(),
      percentage: v.number(),
    })),
    comparison: v.object({
      previousWeek: v.number(),
      growth: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        weekInfo: { startDate: "", endDate: "", weekNumber: 0, year: 0 },
        weekStats: { totalMinutes: 0, totalTasks: 0, activeDays: 0, averagePerDay: 0, consistency: 0 },
        dailyData: [],
        topicBreakdown: {},
        comparison: { previousWeek: 0, growth: 0 },
      };
    }

    const dayStartHour = args.dayStartHour ?? 6;
    const weekOffset = args.weekOffset ?? 0;
    
    const { start: weekStart, end: weekEnd } = getWeekBoundaries(weekOffset, dayStartHour);
    const { start: prevWeekStart, end: prevWeekEnd } = getWeekBoundaries(weekOffset - 1, dayStartHour);

    // Get entries for current and previous week
    const [weekEntries, prevWeekEntries] = await Promise.all([
      ctx.db
        .query("timeEntries")
        .withIndex("by_user_date", (q) => 
          q.eq("userId", userId)
           .gte("startedAt", weekStart)
           .lt("startedAt", weekEnd)
        )
        .collect(),
      ctx.db
        .query("timeEntries")
        .withIndex("by_user_date", (q) => 
          q.eq("userId", userId)
           .gte("startedAt", prevWeekStart)
           .lt("startedAt", prevWeekEnd)
        )
        .collect()
    ]);

    // Calculate week info
    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd - 1);
    const weekNumber = Math.ceil(startDate.getDate() / 7);
    
    const weekInfo = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      weekNumber,
      year: startDate.getFullYear(),
    };

    // Process daily data
    const dailyMap = new Map<string, { totalMinutes: number; tasksCount: number; topics: Map<string, number> }>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize all 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart + (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, { totalMinutes: 0, tasksCount: 0, topics: new Map() });
    }

    // Process week entries
    const taskIds = new Set<string>();
    const topicTotals = new Map<string, number>();
    
    weekEntries.forEach(entry => {
      const date = new Date(entry.startedAt);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = dailyMap.get(dateStr);
      if (dayData) {
        dayData.totalMinutes += entry.duration;
        taskIds.add(entry.taskId);
        
        const topic = sanitizeKey(entry.taskTopic || "Uncategorized");
        dayData.topics.set(topic, (dayData.topics.get(topic) || 0) + entry.duration);
        topicTotals.set(topic, (topicTotals.get(topic) || 0) + entry.duration);
        
        // Track unique tasks per day
        const taskKey = `${dateStr}-${entry.taskId}`;
        if (!dayData.hasOwnProperty(taskKey)) {
          dayData.tasksCount++;
          (dayData as any)[taskKey] = true;
        }
      }
    });

    // Calculate stats
    const totalMinutes = weekEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const totalTasks = taskIds.size;
    const activeDays = Array.from(dailyMap.values()).filter(day => day.totalMinutes > 0).length;
    const averagePerDay = activeDays > 0 ? totalMinutes / activeDays : 0;
    const consistency = (activeDays / 7) * 100;

    // Prepare daily data
    const dailyData = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data], index) => ({
        date,
        dayName: dayNames[index],
        totalMinutes: data.totalMinutes,
        tasksCount: data.tasksCount,
        topics: Object.fromEntries(
          Array.from(data.topics.entries()).map(([topic, minutes]) => [topic, minutes])
        ),
      }));

    // Prepare topic breakdown
    const topicBreakdown = Object.fromEntries(
      Array.from(topicTotals.entries()).map(([topic, minutes]) => [
        topic,
        {
          totalMinutes: minutes,
          percentage: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0,
        }
      ])
    );

    // Calculate comparison with previous week
    const prevWeekMinutes = prevWeekEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const growth = prevWeekMinutes > 0 ? ((totalMinutes - prevWeekMinutes) / prevWeekMinutes) * 100 : 0;

    return {
      weekInfo,
      weekStats: {
        totalMinutes,
        totalTasks,
        activeDays,
        averagePerDay,
        consistency,
      },
      dailyData,
      topicBreakdown,
      comparison: {
        previousWeek: prevWeekMinutes,
        growth,
      },
    };
  },
});