import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  tasks: defineTable({
    title: v.string(),
    topic: v.string(),
    subtopic: v.string(),
    createdAt: v.number(),
    userId: v.id("users"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by topic", ["topic"]),

  plans: defineTable({
    date: v.string(),
    userId: v.id("users"),
    planContent: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user_date", ["userId", "date"]),

  timeEntries: defineTable({
    taskId: v.id("tasks"),
    duration: v.number(),
    startedAt: v.number(),
    note: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_task", ["taskId"])
    .index("by_user_date", ["userId", "startedAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
