import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserOrThrow, taskColorValidator, TaskColorKey } from "./utils";

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    topic: v.optional(v.string()),
    subtopic: v.optional(v.string()),
    color: v.optional(taskColorValidator),
  },

  handler: async (ctx, args) => {
    const userId = await getUserOrThrow(ctx);

    return await ctx.db.insert("tasks", {
      title: args.title,
      topic: args.topic,
      subtopic: args.subtopic,
      color: args.color,
      createdAt: Date.now(),
      userId,
    });
  },
});

// Delete a task (hard delete, but entries remain)
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },

  handler: async (ctx, args) => {
    const userId = await getUserOrThrow(ctx);

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Invalid task");

    await ctx.db.delete(args.taskId);
  },
});

// Update a task's fields (all optional - update only what's provided)
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    topic: v.optional(v.string()),
    subtopic: v.optional(v.string()),
    color: v.optional(v.union(taskColorValidator, v.null())), // allows setting to null to clear
  },

  handler: async (ctx, args) => {
    const userId = await getUserOrThrow(ctx);

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId) throw new Error("Invalid task");

    // Build update object with only provided fields
    const updates: Partial<{
      title: string;
      topic?: string;
      subtopic?: string;
      color?: TaskColorKey | undefined;
    }> = {};
    
    if (args.title !== undefined) updates.title = args.title;
    if (args.topic !== undefined) updates.topic = args.topic;
    if (args.subtopic !== undefined) updates.subtopic = args.subtopic;
    if (args.color !== undefined) {
      // Normalize null to undefined for consistency with schema
      updates.color = args.color === null ? undefined : args.color;
    }

    // Update the task
    await ctx.db.patch(args.taskId, updates);

    // If any denormalized fields changed, update related timeEntries
    const needsDenormalizationUpdate = 
      args.title !== undefined || 
      args.topic !== undefined || 
      args.subtopic !== undefined || 
      args.color !== undefined;

    if (needsDenormalizationUpdate) {
      const relatedEntries = await ctx.db
        .query("timeEntries")
        .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
        .collect();

      const updatedTask = await ctx.db.get(args.taskId);
      if (updatedTask) {
        await Promise.all(
          relatedEntries.map((entry) => {
            const entryUpdates: Partial<{
              taskTitle: string;
              taskTopic?: string;
              taskSubtopic?: string;
              taskColor?: TaskColorKey | undefined;
            }> = {};
            
            if (args.title !== undefined) entryUpdates.taskTitle = updatedTask.title;
            if (args.topic !== undefined) entryUpdates.taskTopic = updatedTask.topic;
            if (args.subtopic !== undefined) entryUpdates.taskSubtopic = updatedTask.subtopic;
            if (args.color !== undefined) entryUpdates.taskColor = updatedTask.color;
            
            return ctx.db.patch(entry._id, entryUpdates);
          })
        );
      }
    }
  },
});


export const keepAlive = internalMutation({
  args: {},
  handler: async () => "ok",
});
