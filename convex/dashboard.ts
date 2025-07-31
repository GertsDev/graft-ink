import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to check if timestamp is within the user's "today" (custom day boundary)
function isToday(timestamp: number, todayStart: number): boolean {
  return (
    timestamp >= todayStart && timestamp < todayStart + 24 * 60 * 60 * 1000
  );
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
      const key = `${entry.taskTopic || "Uncategorized"}/${entry.taskTitle}`;
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
        createdAt: v.number(),
        userId: v.id("users"),
        totalTime: v.number(),
        todayTime: v.number(),
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
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { tasks: [], timeEntries: {}, totalToday: 0 };
    }

    // Get all user data in parallel for efficiency
    const [tasks, allEntries] = await Promise.all([
      ctx.db
        .query("tasks")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("timeEntries")
        .withIndex("by_user_date", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    // Calculate today's total from all entries
    const totalToday = allEntries
      .filter((e) => isToday(e.startedAt, args.todayStart))
      .reduce((sum, e) => sum + e.duration, 0);

    // Enrich tasks with time calculations
    const tasksWithTime = tasks.map((task) => {
      const taskEntries = allEntries.filter((e) => e.taskId === task._id);
      const totalTime = taskEntries.reduce((sum, e) => sum + e.duration, 0);
      const todayTime = taskEntries
        .filter((e) => isToday(e.startedAt, args.todayStart))
        .reduce((sum, e) => sum + e.duration, 0);

      return { ...task, totalTime, todayTime };
    });

    // Group entries for analytics (same format as before)
    const timeEntries = groupEntriesByTopic(allEntries);

    return {
      tasks: tasksWithTime,
      timeEntries,
      totalToday,
    };
  },
});
