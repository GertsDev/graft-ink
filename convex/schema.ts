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

  userSettings: defineTable({
    userId: v.id("users"),
    dayStartHour: v.number(), // 0-23, represents hour of day when user's day starts
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Milestone tracking for celebration system
  milestones: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("time_milestone"),     // 1hr, 2hr, 3hr achievements
      v.literal("task_milestone"),     // Task completion milestones
      v.literal("streak_milestone"),   // Daily streak achievements
      v.literal("consistency_score")   // Weekly/monthly consistency
    ),
    value: v.number(),               // Milestone value (minutes for time, days for streak)
    achievedAt: v.number(),          // Timestamp when achieved
    taskId: v.optional(v.id("tasks")), // Associated task if applicable
    metadata: v.optional(v.object({  // Flexible data for different milestone types
      streakCount: v.optional(v.number()),
      consistencyScore: v.optional(v.number()),
      weeklyTotal: v.optional(v.number()),
      taskTitle: v.optional(v.string()),
      celebrationShown: v.optional(v.boolean()),
    })),
  })
    .index("by_user_type", ["userId", "type"])
    .index("by_user_date", ["userId", "achievedAt"]),

  // User analytics and streak data
  userStats: defineTable({
    userId: v.id("users"),
    date: v.string(),               // YYYY-MM-DD format for daily stats
    dailyMinutes: v.number(),       // Total minutes for the day
    tasksWorkedOn: v.number(),      // Number of unique tasks
    streakCount: v.number(),        // Current streak at end of day
    consistencyScore: v.number(),   // 0-100 score for the day
    momentum: v.number(),           // Momentum factor (last 7 days trend)
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_created", ["userId", "createdAt"]),

  // Celebration events to avoid duplicate celebrations
  celebrations: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("time_added"),
      v.literal("milestone_reached"),
      v.literal("streak_achieved"),
      v.literal("goal_completed")
    ),
    triggeredAt: v.number(),
    milestoneId: v.optional(v.id("milestones")),
    shown: v.boolean(),             // Whether celebration was displayed
    value: v.optional(v.number()),  // Associated value (minutes, streak days, etc.)
  })
    .index("by_user_type", ["userId", "type"])
    .index("by_user_date", ["userId", "triggeredAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
