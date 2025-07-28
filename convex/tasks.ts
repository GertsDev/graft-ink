import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    topic: v.optional(v.string()),
    subtopic: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.insert("tasks", {
      title: args.title,
      topic: args.topic,
      subtopic: args.subtopic,
      createdAt: Date.now(),
      userId,
    });
  },
});

// Delete a task (hard delete, but entries remain)
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Invalid task");

    await ctx.db.delete(args.taskId);
  },
});

// Get user's active tasks with aggregated time (no completed filtering)
export const getUserTaskWithTime = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const todayStart = new Date().setHours(0, 0, 0, 0);
    return Promise.all(
      tasks.map(async (task) => {
        const entries = await ctx.db
          .query("timeEntries")
          .withIndex("by_task", (q) => q.eq("taskId", task._id))
          .collect();

        const totalTime = entries.reduce((sum, e) => sum + e.duration, 0);
        const todayTime = entries
          .filter((e) => e.startedAt >= todayStart)
          .reduce((sum, e) => sum + e.duration, 0);

        return { ...task, totalTime, todayTime };
      }),
    );
  },
});
