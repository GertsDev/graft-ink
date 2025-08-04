import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to format date
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get productivity insights for storytelling
export const getProductivityInsights = query({
  args: { 
    days: v.optional(v.number()), // Default 30 days
  },
  returns: v.object({
    streakData: v.object({
      currentStreak: v.number(),
      longestStreak: v.number(),
      streakMilestones: v.array(v.object({
        value: v.number(),
        achievedAt: v.number(),
      })),
    }),
    consistencyScore: v.object({
      current: v.number(),
      trend: v.string(), // "improving", "stable", "declining"
      weeklyAverage: v.number(),
    }),
    momentumData: v.object({
      current: v.number(),
      trendDirection: v.string(), // "up", "down", "stable"
      last7DaysAvg: v.number(),
    }),
    milestoneProgress: v.object({
      nextTimeMilestone: v.optional(v.number()),
      progressToNext: v.number(), // 0-1
      recentAchievements: v.array(v.object({
        type: v.string(),
        value: v.number(),
        achievedAt: v.number(),
      })),
    }),
    storyNarrative: v.object({
      phase: v.string(), // "beginning", "building", "flourishing", "mastery"
      message: v.string(),
      achievements: v.array(v.string()),
      nextGoals: v.array(v.string()),
    }),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        streakData: { currentStreak: 0, longestStreak: 0, streakMilestones: [] },
        consistencyScore: { current: 0, trend: "stable", weeklyAverage: 0 },
        momentumData: { current: 0, trendDirection: "stable", last7DaysAvg: 0 },
        milestoneProgress: { progressToNext: 0, recentAchievements: [] },
        storyNarrative: { 
          phase: "beginning", 
          message: "Your journey awaits...", 
          achievements: [], 
          nextGoals: ["Start tracking your first task"] 
        },
      };
    }

    const daysToFetch = args.days ?? 30;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (daysToFetch * 24 * 60 * 60 * 1000));

    // Get user stats and milestones in parallel
    const [userStats, milestones, timeEntries] = await Promise.all([
      ctx.db
        .query("userStats")
        .withIndex("by_user_date", (q) => q.eq("userId", userId))
        .filter((q) => q.gte(q.field("date"), formatDate(startDate)))
        .order("desc")
        .collect(),
      ctx.db
        .query("milestones")
        .withIndex("by_user_date", (q) => q.eq("userId", userId))
        .order("desc")
        .take(20),
      ctx.db
        .query("timeEntries")
        .withIndex("by_user_date", (q) => 
          q.eq("userId", userId)
            .gte("startedAt", startDate.getTime())
        )
        .collect(),
    ]);

    // Calculate streak data
    const currentStreak = userStats[0]?.streakCount ?? 0;
    const longestStreak = Math.max(...userStats.map(s => s.streakCount), 0);
    const streakMilestones = milestones
      .filter(m => m.type === "streak_milestone")
      .map(m => ({ value: m.value, achievedAt: m.achievedAt }));

    // Calculate consistency
    const avgConsistency = userStats.length > 0 
      ? userStats.reduce((sum, s) => sum + s.consistencyScore, 0) / userStats.length
      : 0;
    const last7Days = userStats.slice(0, 7);
    const prev7Days = userStats.slice(7, 14);
    const last7Avg = last7Days.length > 0 
      ? last7Days.reduce((sum, s) => sum + s.consistencyScore, 0) / last7Days.length 
      : 0;
    const prev7Avg = prev7Days.length > 0 
      ? prev7Days.reduce((sum, s) => sum + s.consistencyScore, 0) / prev7Days.length 
      : 0;
    
    const consistencyTrend = last7Avg > prev7Avg + 5 ? "improving" :
                           last7Avg < prev7Avg - 5 ? "declining" : "stable";

    // Calculate momentum
    const currentMomentum = userStats[0]?.momentum ?? 0;
    const last7DaysMinutes = last7Days.reduce((sum, s) => sum + s.dailyMinutes, 0);
    const last7DaysAvg = last7Days.length > 0 ? last7DaysMinutes / last7Days.length : 0;
    const prev7DaysMinutes = prev7Days.reduce((sum, s) => sum + s.dailyMinutes, 0);
    const prev7DaysAvg = prev7Days.length > 0 ? prev7DaysMinutes / prev7Days.length : 0;
    
    const momentumTrend = last7DaysAvg > prev7DaysAvg * 1.1 ? "up" :
                         last7DaysAvg < prev7DaysAvg * 0.9 ? "down" : "stable";

    // Calculate milestone progress
    const timeMilestones = [60, 120, 180, 240, 300, 360, 480, 600]; // minutes
    const totalMinutes = timeEntries.reduce((sum, e) => sum + e.duration, 0);
    const nextTimeMilestone = timeMilestones.find(m => m > totalMinutes);
    const progressToNext = nextTimeMilestone 
      ? (totalMinutes % nextTimeMilestone) / nextTimeMilestone
      : 1;

    const recentAchievements = milestones
      .slice(0, 5)
      .map(m => ({
        type: m.type,
        value: m.value,
        achievedAt: m.achievedAt,
      }));

    // Generate story narrative
    const totalHours = totalMinutes / 60;
    const phase = totalHours < 10 ? "beginning" :
                 totalHours < 50 ? "building" :
                 totalHours < 150 ? "flourishing" : "mastery";

    const achievements = [];
    const nextGoals = [];

    if (currentStreak >= 7) achievements.push(`${currentStreak}-day consistency streak`);
    if (totalHours >= 50) achievements.push(`${Math.floor(totalHours)} hours of focused work`);
    if (streakMilestones.length > 0) achievements.push(`${streakMilestones.length} streak milestones`);

    if (currentStreak < 7) nextGoals.push("Build a 7-day streak");
    if (nextTimeMilestone) nextGoals.push(`Reach ${nextTimeMilestone / 60}h milestone`);
    if (avgConsistency < 80) nextGoals.push("Improve daily consistency");

    const message = phase === "beginning" ? "Every expert was once a beginner. Your journey of growth starts now." :
                   phase === "building" ? "You're building momentum! Each session strengthens your foundation." :
                   phase === "flourishing" ? "Your dedication is paying off. You're in full flow!" :
                   "You've achieved mastery through consistent effort. What new heights will you reach?";

    return {
      streakData: {
        currentStreak,
        longestStreak,
        streakMilestones,
      },
      consistencyScore: {
        current: avgConsistency,
        trend: consistencyTrend,
        weeklyAverage: last7Avg,
      },
      momentumData: {
        current: currentMomentum,
        trendDirection: momentumTrend,
        last7DaysAvg,
      },
      milestoneProgress: {
        nextTimeMilestone,
        progressToNext,
        recentAchievements,
      },
      storyNarrative: {
        phase,
        message,
        achievements,
        nextGoals,
      },
    };
  },
});

// Get weekly pattern analysis for visual storytelling
export const getWeeklyPatterns = query({
  args: { weeks: v.optional(v.number()) },
  returns: v.object({
    weeklyData: v.array(v.object({
      weekStart: v.string(),
      totalMinutes: v.number(),
      avgDailyMinutes: v.number(),
      workingDays: v.number(),
      consistencyScore: v.number(),
      topTasks: v.array(v.object({
        title: v.string(),
        topic: v.optional(v.string()),
        minutes: v.number(),
      })),
    })),
    patterns: v.object({
      bestDay: v.string(),
      bestTime: v.string(), // "morning", "afternoon", "evening"
      peakProductivityHour: v.number(),
      mostProductiveWeek: v.string(),
      growthTrend: v.string(), // "increasing", "decreasing", "stable"
    }),
    insights: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        weeklyData: [],
        patterns: {
          bestDay: "Unknown",
          bestTime: "Unknown",
          peakProductivityHour: 9,
          mostProductiveWeek: "Unknown",
          growthTrend: "stable",
        },
        insights: ["Start tracking time to see your patterns emerge!"],
      };
    }

    const weeksToFetch = args.weeks ?? 8;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (weeksToFetch * 7 * 24 * 60 * 60 * 1000));

    // Get time entries for analysis
    const timeEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", userId)
          .gte("startedAt", startDate.getTime())
      )
      .collect();

    // Group by week
    const weeklyData = new Map<string, {
      entries: typeof timeEntries,
      totalMinutes: number,
      days: Set<string>,
    }>();

    timeEntries.forEach(entry => {
      const entryDate = new Date(entry.startedAt);
      const weekStart = new Date(entryDate);
      weekStart.setDate(entryDate.getDate() - entryDate.getDay()); // Start of week (Sunday)
      const weekKey = formatDate(weekStart);
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          entries: [],
          totalMinutes: 0,
          days: new Set(),
        });
      }
      
      const week = weeklyData.get(weekKey)!;
      week.entries.push(entry);
      week.totalMinutes += entry.duration;
      week.days.add(formatDate(entryDate));
    });

    // Process weekly data
    const processedWeeks = Array.from(weeklyData.entries()).map(([weekStart, data]) => {
      const workingDays = data.days.size;
      const avgDailyMinutes = workingDays > 0 ? data.totalMinutes / workingDays : 0;
      const consistencyScore = Math.min(100, (workingDays / 7) * 100);

      // Get top tasks for the week
      const taskMinutes = new Map<string, number>();
      const taskInfo = new Map<string, { title: string, topic?: string }>();
      
      data.entries.forEach(entry => {
        const key = `${entry.taskTopic || 'Uncategorized'}/${entry.taskTitle}`;
        taskMinutes.set(key, (taskMinutes.get(key) || 0) + entry.duration);
        taskInfo.set(key, { title: entry.taskTitle, topic: entry.taskTopic });
      });

      const topTasks = Array.from(taskMinutes.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([key, minutes]) => ({
          ...taskInfo.get(key)!,
          minutes,
        }));

      return {
        weekStart,
        totalMinutes: data.totalMinutes,
        avgDailyMinutes,
        workingDays,
        consistencyScore,
        topTasks,
      };
    }).sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    // Analyze patterns
    const dayTotals = new Map<string, number>();
    const hourTotals = new Map<number, number>();
    
    timeEntries.forEach(entry => {
      const date = new Date(entry.startedAt);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();
      
      dayTotals.set(dayName, (dayTotals.get(dayName) || 0) + entry.duration);
      hourTotals.set(hour, (hourTotals.get(hour) || 0) + entry.duration);
    });

    const bestDay = Array.from(dayTotals.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "Unknown";

    const peakHour = Array.from(hourTotals.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 9;

    const bestTime = peakHour < 12 ? "morning" :
                    peakHour < 17 ? "afternoon" : "evening";

    const mostProductiveWeek = processedWeeks
      .sort((a, b) => b.totalMinutes - a.totalMinutes)[0]?.weekStart || "Unknown";

    // Calculate growth trend
    const firstHalf = processedWeeks.slice(0, Math.floor(processedWeeks.length / 2));
    const secondHalf = processedWeeks.slice(Math.floor(processedWeeks.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, w) => sum + w.totalMinutes, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, w) => sum + w.totalMinutes, 0) / secondHalf.length;
    
    const growthTrend = secondHalfAvg > firstHalfAvg * 1.1 ? "increasing" :
                       secondHalfAvg < firstHalfAvg * 0.9 ? "decreasing" : "stable";

    // Generate insights
    const insights = [];
    if (bestDay !== "Unknown") insights.push(`Your most productive day is ${bestDay}`);
    if (peakHour) insights.push(`You're most focused at ${peakHour}:00`);
    if (growthTrend === "increasing") insights.push("Your productivity is trending upward!");
    if (processedWeeks.some(w => w.workingDays >= 5)) insights.push("You've built a consistent weekly routine");

    return {
      weeklyData: processedWeeks,
      patterns: {
        bestDay,
        bestTime,
        peakProductivityHour: peakHour,
        mostProductiveWeek,
        growthTrend,
      },
      insights,
    };
  },
});

// Get task growth stories for plant metaphor
export const getTaskGrowthStories = query({
  args: {},
  returns: v.array(v.object({
    taskId: v.id("tasks"),
    title: v.string(),
    topic: v.optional(v.string()),
    totalMinutes: v.number(),
    growthStage: v.string(),
    growthMessage: v.string(),
    milestones: v.array(v.object({
      threshold: v.number(),
      achieved: v.boolean(),
      achievedAt: v.optional(v.number()),
    })),
    recentActivity: v.array(v.object({
      date: v.string(),
      minutes: v.number(),
    })),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get tasks and their time entries
    const [tasks, timeEntries] = await Promise.all([
      ctx.db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("timeEntries")
        .withIndex("by_user_date", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    // Group entries by task
    const taskEntries = new Map<string, typeof timeEntries>();
    timeEntries.forEach(entry => {
      const taskId = entry.taskId;
      if (!taskEntries.has(taskId)) {
        taskEntries.set(taskId, []);
      }
      taskEntries.get(taskId)!.push(entry);
    });

    // Process each task
    const growthThresholds = [30, 60, 120, 180, 300, 480]; // minutes
    
    return tasks.map(task => {
      const entries = taskEntries.get(task._id) || [];
      const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
      
      // Determine growth stage
      const stage = totalMinutes === 0 ? "seed" :
                   totalMinutes < 60 ? "sprout" :
                   totalMinutes < 180 ? "sapling" :
                   totalMinutes < 360 ? "tree" : "forest";

      const growthMessage = stage === "seed" ? "Ready to sprout with your first session" :
                          stage === "sprout" ? "First green shoots are showing!" :
                          stage === "sapling" ? "Growing stronger with each session" :
                          stage === "tree" ? "Flourishing with deep expertise" :
                          "A mighty forest of knowledge and skill";

      // Calculate milestone progress
      const milestones = growthThresholds.map(threshold => {
        const achieved = totalMinutes >= threshold;
        const milestone = entries
          .reduce((acc, entry) => {
            const runningTotal = acc.total + entry.duration;
            if (acc.total < threshold && runningTotal >= threshold) {
              acc.achievedAt = entry.startedAt;
            }
            acc.total = runningTotal;
            return acc;
          }, { total: 0, achievedAt: undefined as number | undefined });

        return {
          threshold,
          achieved,
          achievedAt: milestone.achievedAt,
        };
      });

      // Recent activity (last 7 days)
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentEntries = entries.filter(e => e.startedAt >= last7Days.getTime());
      
      const dailyActivity = new Map<string, number>();
      recentEntries.forEach(entry => {
        const date = formatDate(new Date(entry.startedAt));
        dailyActivity.set(date, (dailyActivity.get(date) || 0) + entry.duration);
      });

      const recentActivity = Array.from(dailyActivity.entries())
        .map(([date, minutes]) => ({ date, minutes }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        taskId: task._id,
        title: task.title,
        topic: task.topic,
        totalMinutes,
        growthStage: stage,
        growthMessage,
        milestones,
        recentActivity,
      };
    }).sort((a, b) => b.totalMinutes - a.totalMinutes);
  },
});