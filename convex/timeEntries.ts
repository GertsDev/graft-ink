import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    taskId: v.id("tasks"),
    duration: v.number(),
    note: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Invalid task");

    return await ctx.db.insert("timeEntries", {
      taskId: args.taskId,
      taskTitle: task.title, // Denormalize
      taskTopic: task.topic, // Denormalize
      taskSubtopic: task.subtopic, // Denormalize
      duration: args.duration,
      startedAt: Date.now(),
      note: args.note,
      userId,
    });
  },
});

// For analytics: Get entries by date range, grouped by topic/title
export const getByRange = query({
  args: { start: v.number(), end: v.number() },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", userId)
          .gte("startedAt", args.start)
          .lt("startedAt", args.end),
      )
      .collect();

    // Group by topic/title for analytics UI (e.g., charts)
    const grouped = entries.reduce(
      (acc, entry) => {
        const key = `${entry.taskTopic || "Uncategorized"}/${entry.taskTitle}`;
        if (!acc[key]) acc[key] = { total: 0, entries: [] };
        acc[key].total += entry.duration;
        acc[key].entries.push(entry);
        return acc;
      },
      {} as Record<string, { total: number; entries: typeof entries }>,
    );
    return grouped;
  },
});
