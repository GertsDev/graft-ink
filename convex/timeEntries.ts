import { getAuthUserId } from "@convex-dev/auth/server";
import { getUserOrThrow } from "./utils";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const add = mutation({
  args: {
    taskId: v.id("tasks"),
    duration: v.number(),
    note: v.optional(v.string()),
  },
  returns: v.id("timeEntries"),
  handler: async (ctx, args) => {
    const userId = await getUserOrThrow(ctx);

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Invalid task");

    // Calculate previous total time for milestone checking
    const existingEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    
    const previousTotalMinutes = existingEntries.reduce((sum, e) => sum + e.duration, 0);
    const newTotalMinutes = previousTotalMinutes + args.duration;

    // Insert the time entry
    const entryId = await ctx.db.insert("timeEntries", {
      taskId: args.taskId,
      taskTitle: task.title, // Denormalize
      taskTopic: task.topic, // Denormalize
      taskSubtopic: task.subtopic, // Denormalize
      duration: args.duration,
      startedAt: Date.now(),
      note: args.note,
      userId,
    });

    // Check for time milestones asynchronously
    await ctx.scheduler.runAfter(0, internal.milestones.checkTimeMilestones, {
      userId,
      newTotalMinutes,
      previousTotalMinutes,
      taskId: args.taskId,
      taskTitle: task.title,
    });

    // Trigger time-added celebration
    await ctx.db.insert("celebrations", {
      userId,
      type: "time_added",
      triggeredAt: Date.now(),
      shown: false,
      value: args.duration,
    });

    // Update daily stats asynchronously
    const today = new Date().toISOString().split('T')[0];
    const userSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    const dayStartHour = userSettings?.dayStartHour ?? 6;
    
    // Get today's total minutes and tasks count
    const todayEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => {
        const dayStart = new Date();
        dayStart.setHours(dayStartHour, 0, 0, 0);
        return q.gte(q.field("startedAt"), dayStart.getTime());
      })
      .collect();
    
    const dailyMinutes = todayEntries.reduce((sum, e) => sum + e.duration, 0);
    const uniqueTasks = new Set(todayEntries.map(e => e.taskId)).size;
    
    await ctx.scheduler.runAfter(0, internal.milestones.updateDailyStats, {
      userId,
      date: today,
      dailyMinutes,
      tasksWorkedOn: uniqueTasks,
      dayStartHour,
    });

    return entryId;
  },
});

// For analytics: Get entries by date range, grouped by topic/title
export const getByRange = query({
  args: { start: v.number(), end: v.number() },
  returns: v.record(
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
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return {};

    const rawEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", userId)
          .gte("startedAt", args.start)
          .lt("startedAt", args.end),
      )
      .collect();

    // Simplify docs to only required fields for client UI.
    const entries = rawEntries.map((e) => ({
      taskTitle: e.taskTitle,
      taskTopic: e.taskTopic ?? undefined,
      duration: e.duration,
      startedAt: e.startedAt,
    }));

    const grouped = entries.reduce<
      Record<string, { total: number; entries: typeof entries }>
    >((acc, entry) => {
      const key = `${entry.taskTopic || "Uncategorized"}/${entry.taskTitle}`;
      if (!acc[key]) acc[key] = { total: 0, entries: [] };
      acc[key].total += entry.duration;
      acc[key].entries.push(entry);
      return acc;
    }, {});
    return grouped;
  },
});
