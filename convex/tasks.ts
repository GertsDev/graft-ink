import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, mutation, query } from "./_generated/server";
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

// Update a task's title/topic/subtopic
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
    topic: v.optional(v.string()),
    subtopic: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Invalid task");

    await ctx.db.patch(args.taskId, {
      title: args.title,
      topic: args.topic,
      subtopic: args.subtopic,
    });
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

    // Get all time entries for this user to avoid N+1 queries
    const allEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .collect();

    return tasks.map((task) => {
      const taskEntries = allEntries.filter((e) => e.taskId === task._id);
      const totalTime = taskEntries.reduce((sum, e) => sum + e.duration, 0);

      // Note: todayTime calculation removed from server - client should handle timezone-specific "today"
      // This ensures consistency with analytics which handles "today" client-side
      const todayTime = 0;

      return { ...task, totalTime, todayTime };
    });
  },
});

// Get tasks with client-calculated today time for consistency
export const getUserTasksWithClientTodayTime = query({
  args: { todayStart: v.number() },
  returns: v.array(
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
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get all time entries for this user to avoid N+1 queries
    const allEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .collect();

    return tasks.map((task) => {
      const taskEntries = allEntries.filter((e) => e.taskId === task._id);
      const totalTime = taskEntries.reduce((sum, e) => sum + e.duration, 0);
      const todayTime = taskEntries
        .filter((e) => e.startedAt >= args.todayStart && e.startedAt < args.todayStart + 24 * 60 * 60 * 1000)
        .reduce((sum, e) => sum + e.duration, 0);

      return { ...task, totalTime, todayTime };
    });
  },
});

export const keepAlive = internalMutation({
  args: {},
  handler: async () => "ok",
});
