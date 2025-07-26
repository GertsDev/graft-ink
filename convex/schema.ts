import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  tasks: defineTable({
    title: v.string(),
    topic: v.optional(v.string()),
    subtopic: v.optional(v.string()),
    createdAt: v.number(),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_topic", ["topic"]),

  timeEntries: defineTable({
    taskId: v.id("tasks"),
    taskTitle: v.string(), // Denormalized
    taskTopic: v.optional(v.string()), // Denormalized
    taskSubtopic: v.optional(v.string()), // Denormalized
    duration: v.number(),
    startedAt: v.number(),
    note: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_task", ["taskId"])
    .index("by_user_date", ["userId", "startedAt"]),

  plans: defineTable({
    date: v.string(),
    userId: v.id("users"),
    planContent: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user_date", ["userId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
