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
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
