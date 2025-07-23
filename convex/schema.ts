import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  tasks: defineTable({
    title: v.string(),
    topic: v.string(),
    subtopic: v.string(),
    totalTime: v.number(),
    createdAt: v.number(),
    userId: v.id("users"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

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
