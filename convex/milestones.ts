import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Milestone thresholds (in minutes)
const TIME_MILESTONES = [60, 120, 180, 240, 300, 360]; // 1hr, 2hr, 3hr, 4hr, 5hr, 6hr
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]; // days

// Check and record time-based milestones
export const checkTimeMilestones = internalMutation({
  args: {
    userId: v.id("users"),
    newTotalMinutes: v.number(),
    previousTotalMinutes: v.number(),
    taskId: v.optional(v.id("tasks")),
    taskTitle: v.optional(v.string()),
  },
  returns: v.array(v.object({
    type: v.literal("time_milestone"),
    value: v.number(),
    isNew: v.boolean(),
  })),
  handler: async (ctx, args) => {
    const milestones = [];
    
    // Check which milestones were crossed
    for (const threshold of TIME_MILESTONES) {
      if (args.newTotalMinutes >= threshold && args.previousTotalMinutes < threshold) {
        // New milestone achieved!
        const milestoneId = await ctx.db.insert("milestones", {
          userId: args.userId,
          type: "time_milestone",
          value: threshold,
          achievedAt: Date.now(),
          taskId: args.taskId,
          metadata: {
            taskTitle: args.taskTitle,
            celebrationShown: false,
          },
        });

        milestones.push({
          type: "time_milestone" as const,
          value: threshold,
          isNew: true,
        });

        // Queue celebration
        await ctx.db.insert("celebrations", {
          userId: args.userId,
          type: "milestone_reached",
          triggeredAt: Date.now(),
          milestoneId,
          shown: false,
          value: threshold,
        });
      }
    }

    return milestones;
  },
});

// Calculate daily streak
export const calculateStreak = internalMutation({
  args: {
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD
    dayStartHour: v.number(),
  },
  returns: v.object({
    streakCount: v.number(),
    isNewStreakMilestone: v.boolean(),
    streakMilestoneValue: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    const today = args.date;
    const yesterday = new Date(new Date(today).getTime() - 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    // Get user stats for recent days (last 100 days should be enough)
    const recentStats = await ctx.db
      .query("userStats")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(100);

    // Calculate streak
    let streakCount = 0;
    const statsByDate = new Map(recentStats.map(s => [s.date, s]));
    
    // Check if today has activity (>= 30 minutes minimum for streak)
    const todayStats = statsByDate.get(today);
    if (todayStats && todayStats.dailyMinutes >= 30) {
      streakCount = 1;
      
      // Count backwards from yesterday
      let checkDate = yesterday;
      while (true) {
        const dayStats = statsByDate.get(checkDate);
        if (!dayStats || dayStats.dailyMinutes < 30) break;
        
        streakCount++;
        
        // Move to previous day
        const date = new Date(checkDate);
        date.setDate(date.getDate() - 1);
        checkDate = date.toISOString().split('T')[0];
      }
    }

    // Check for streak milestones
    let isNewStreakMilestone = false;
    let streakMilestoneValue: number | undefined;
    
    const previousStreak = recentStats.find(s => s.date === yesterday)?.streakCount ?? 0;
    
    for (const threshold of STREAK_MILESTONES) {
      if (streakCount >= threshold && previousStreak < threshold) {
        isNewStreakMilestone = true;
        streakMilestoneValue = threshold;
        
        // Record milestone
        const milestoneId = await ctx.db.insert("milestones", {
          userId: args.userId,
          type: "streak_milestone",
          value: threshold,
          achievedAt: Date.now(),
          metadata: {
            streakCount,
            celebrationShown: false,
          },
        });

        // Queue celebration
        await ctx.db.insert("celebrations", {
          userId: args.userId,
          type: "streak_achieved",
          triggeredAt: Date.now(),
          milestoneId,
          shown: false,
          value: threshold,
        });
        break; // Only celebrate the first milestone reached
      }
    }

    return {
      streakCount,
      isNewStreakMilestone,
      streakMilestoneValue,
    };
  },
});

// Update daily user statistics
export const updateDailyStats = internalMutation({
  args: {
    userId: v.id("users"),
    date: v.string(),
    dailyMinutes: v.number(),
    tasksWorkedOn: v.number(),
    dayStartHour: v.number(),
  },
  returns: v.object({
    statsId: v.id("userStats"),
    consistencyScore: v.number(),
    momentum: v.number(),
  }),
  handler: async (ctx, args) => {
    // TODO: Calculate streak directly (simplified for now)
    const streakResult = { streakCount: 1 }; // Placeholder
    // const streakResult = await ctx.runMutation(internal.milestones.calculateStreak, {
    //   userId: args.userId,
    //   date: args.date,
    //   dayStartHour: args.dayStartHour,
    // });

    // Calculate consistency score (based on target vs actual)
    const targetMinutes = 180; // 3 hours default target
    const consistencyScore = Math.min(100, Math.round((args.dailyMinutes / targetMinutes) * 100));

    // Calculate momentum (last 7 days trend)
    const recentStats = await ctx.db
      .query("userStats")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(7);
    
    const avgLast7Days = recentStats.length > 0 
      ? recentStats.reduce((sum, s) => sum + s.dailyMinutes, 0) / recentStats.length
      : 0;
    
    const momentum = args.dailyMinutes > avgLast7Days ? 
      Math.min(100, Math.round(((args.dailyMinutes - avgLast7Days) / avgLast7Days) * 100) + 50) : 
      Math.max(0, 50 - Math.round(((avgLast7Days - args.dailyMinutes) / avgLast7Days) * 100));

    // Upsert daily stats
    const existing = await ctx.db
      .query("userStats")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();

    let statsId;
    if (existing) {
      await ctx.db.patch(existing._id, {
        dailyMinutes: args.dailyMinutes,
        tasksWorkedOn: args.tasksWorkedOn,
        streakCount: streakResult.streakCount,
        consistencyScore,
        momentum,
        updatedAt: Date.now(),
      });
      statsId = existing._id;
    } else {
      statsId = await ctx.db.insert("userStats", {
        userId: args.userId,
        date: args.date,
        dailyMinutes: args.dailyMinutes,
        tasksWorkedOn: args.tasksWorkedOn,
        streakCount: streakResult.streakCount,
        consistencyScore,
        momentum,
        createdAt: Date.now(),
      });
    }

    return {
      statsId,
      consistencyScore,
      momentum,
    };
  },
});

// Get pending celebrations for user
export const getPendingCelebrations = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("celebrations"),
    type: v.union(
      v.literal("time_added"),
      v.literal("milestone_reached"),
      v.literal("streak_achieved"),
      v.literal("goal_completed")
    ),
    value: v.optional(v.number()),
    milestone: v.optional(v.object({
      type: v.union(
        v.literal("time_milestone"),
        v.literal("task_milestone"),
        v.literal("streak_milestone"),
        v.literal("consistency_score")
      ),
      value: v.number(),
      metadata: v.optional(v.object({
        streakCount: v.optional(v.number()),
        taskTitle: v.optional(v.string()),
      })),
    })),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const celebrations = await ctx.db
      .query("celebrations")
      .withIndex("by_user_type", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("shown"), false))
      .order("desc")
      .take(5); // Limit to prevent overwhelming

    // Enrich with milestone data
    const enriched = await Promise.all(
      celebrations.map(async (celebration) => {
        let milestone = undefined;
        if (celebration.milestoneId) {
          const ms = await ctx.db.get(celebration.milestoneId);
          if (ms) {
            milestone = {
              type: ms.type,
              value: ms.value,
              metadata: ms.metadata,
            };
          }
        }
        
        return {
          _id: celebration._id,
          type: celebration.type,
          value: celebration.value,
          milestone,
        };
      })
    );

    return enriched;
  },
});

// Mark celebration as shown
export const markCelebrationShown = mutation({
  args: { celebrationId: v.id("celebrations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const celebration = await ctx.db.get(args.celebrationId);
    if (!celebration || celebration.userId !== userId) {
      throw new Error("Invalid celebration");
    }

    await ctx.db.patch(args.celebrationId, { shown: true });

    // Also mark milestone as shown if exists
    if (celebration.milestoneId) {
      const milestone = await ctx.db.get(celebration.milestoneId);
      if (milestone && milestone.metadata) {
        await ctx.db.patch(celebration.milestoneId, {
          metadata: {
            ...milestone.metadata,
            celebrationShown: true,
          },
        });
      }
    }
  },
});

// Get user milestone history
export const getUserMilestones = query({
  args: { 
    limit: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("time_milestone"),
      v.literal("task_milestone"),
      v.literal("streak_milestone"),
      v.literal("consistency_score")
    )),
  },
  returns: v.array(v.object({
    _id: v.id("milestones"),
    type: v.union(
      v.literal("time_milestone"),
      v.literal("task_milestone"),
      v.literal("streak_milestone"),
      v.literal("consistency_score")
    ),
    value: v.number(),
    achievedAt: v.number(),
    metadata: v.optional(v.object({
      streakCount: v.optional(v.number()),
      taskTitle: v.optional(v.string()),
    })),
  })),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("milestones")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .order("desc");

    if (args.type) {
      query = ctx.db
        .query("milestones")
        .withIndex("by_user_type", (q) => 
          q.eq("userId", userId).eq("type", args.type!)
        )
        .order("desc");
    }

    const milestones = await query.take(args.limit ?? 50);

    return milestones.map(m => ({
      _id: m._id,
      type: m.type,
      value: m.value,
      achievedAt: m.achievedAt,
      metadata: m.metadata ? {
        streakCount: m.metadata.streakCount,
        taskTitle: m.metadata.taskTitle,
      } : undefined,
    }));
  },
});