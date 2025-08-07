import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { taskColorValidator } from "./utils";

// Helper function to check if timestamp is within the user's "today" (custom day boundary)
function isToday(timestamp: number, todayStart: number): boolean {
  return (
    timestamp >= todayStart && timestamp < todayStart + 24 * 60 * 60 * 1000
  );
}

// Helper function to sanitize strings for use as object keys
function sanitizeKey(str: string): string {
  // Replace non-ASCII characters with underscore and limit length
  return str
    .replace(/[^\x20-\x7E]/g, '_') // Replace non-printable ASCII with underscore
    .replace(/[/\\]/g, '_') // Replace slashes that could cause issues
    .substring(0, 50); // Limit length
}

// Helper function to group entries by topic for analytics
function groupEntriesByTopic(
  entries: {
    taskTitle: string;
    taskTopic?: string;
    duration: number;
    startedAt: number;
  }[],
) {
  return entries.reduce(
    (acc, entry) => {
      const topic = sanitizeKey(entry.taskTopic || "Uncategorized");
      const title = sanitizeKey(entry.taskTitle);
      const key = `${topic}_${title}`;
      
      if (!acc[key]) {
        acc[key] = { total: 0, entries: [] };
      }
      acc[key].total += entry.duration;
      acc[key].entries.push({
        taskTitle: entry.taskTitle,
        taskTopic: entry.taskTopic,
        duration: entry.duration,
        startedAt: entry.startedAt,
      });
      return acc;
    },
    {} as Record<string, { total: number; entries: typeof entries }>,
  );
}

// Single comprehensive dashboard query - replaces all the complex preloading
export const getDashboardData = query({
  args: { todayStart: v.number() },
  returns: v.object({
    tasks: v.array(
      v.object({
        _id: v.id("tasks"),
        _creationTime: v.number(),
        title: v.string(),
        topic: v.optional(v.string()),
        subtopic: v.optional(v.string()),
        color: v.optional(taskColorValidator),
        createdAt: v.number(),
        userId: v.id("users"),
        totalTime: v.number(),
        todayTime: v.number(),
        growthStage: v.string(),
        nextMilestone: v.optional(v.number()),
      }),
    ),
    timeEntries: v.record(
      v.string(),
      v.object({
        total: v.number(),
        entries: v.array(
          v.object({
            taskTitle: v.string(),
            taskTopic: v.optional(v.string()),
            duration: v.number(),
            startedAt: v.number(),
          }),
        ),
      }),
    ),
    totalToday: v.number(),
    todayStats: v.object({
      streakCount: v.number(),
      consistencyScore: v.number(),
      momentum: v.number(),
    }),
    pendingCelebrations: v.array(v.object({
      _id: v.id("celebrations"),
      type: v.union(
        v.literal("time_added"),
        v.literal("milestone_reached"),
        v.literal("streak_achieved"),
        v.literal("goal_completed")
      ),
      value: v.optional(v.number()),
      milestoneType: v.optional(v.string()),
    })),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { 
        tasks: [], 
        timeEntries: {}, 
        totalToday: 0,
        todayStats: { streakCount: 0, consistencyScore: 0, momentum: 0 },
        pendingCelebrations: [],
      };
    }

    const today = new Date(args.todayStart).toISOString().split('T')[0];

    // Get all user data in parallel for efficiency
    const [tasks, allEntries, todayStats, celebrations] = await Promise.all([
      ctx.db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("timeEntries")
        .withIndex("by_user_date", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("userStats")
        .withIndex("by_user_date", (q) => 
          q.eq("userId", userId).eq("date", today)
        )
        .first(),
      ctx.db
        .query("celebrations")
        .withIndex("by_user_type", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("shown"), false))
        .order("desc")
        .take(3),
    ]);

    // Calculate today's total from all entries
    const totalToday = allEntries
      .filter((e) => isToday(e.startedAt, args.todayStart))
      .reduce((sum, e) => sum + e.duration, 0);

    // Calculate growth stages and milestones for tasks
    const growthThresholds = [60, 120, 180, 300, 480]; // minutes
    
    // Enrich tasks with time calculations and growth data
    const tasksWithTime = tasks.map((task) => {
      const taskEntries = allEntries.filter((e) => e.taskId === task._id);
      const totalTime = taskEntries.reduce((sum, e) => sum + e.duration, 0);
      const todayTime = taskEntries
        .filter((e) => isToday(e.startedAt, args.todayStart))
        .reduce((sum, e) => sum + e.duration, 0);

      // Determine growth stage
      const growthStage = totalTime === 0 ? "seed" :
                         totalTime < 60 ? "sprout" :
                         totalTime < 180 ? "sapling" :
                         totalTime < 360 ? "tree" : "forest";

      // Find next milestone
      const nextMilestone = growthThresholds.find(threshold => threshold > totalTime);

      return { 
        ...task, 
        totalTime, 
        todayTime, 
        growthStage,
        nextMilestone,
      };
    });

    // Group entries for analytics (same format as before)
    const timeEntries = groupEntriesByTopic(allEntries);

    // Process celebrations with milestone data
    const processedCelebrations = await Promise.all(
      celebrations.map(async (celebration) => {
        let milestoneType = undefined;
        if (celebration.milestoneId) {
          const milestone = await ctx.db.get(celebration.milestoneId);
          milestoneType = milestone?.type;
        }
        
        return {
          _id: celebration._id,
          type: celebration.type,
          value: celebration.value,
          milestoneType,
        };
      })
    );

    return {
      tasks: tasksWithTime,
      timeEntries,
      totalToday,
      todayStats: {
        streakCount: todayStats?.streakCount ?? 0,
        consistencyScore: todayStats?.consistencyScore ?? 0,
        momentum: todayStats?.momentum ?? 0,
      },
      pendingCelebrations: processedCelebrations,
    };
  },
});
