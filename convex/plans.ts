import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Fetch a plan for a specific user and date
export const getPlan = query({
  args: { date: v.string() },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject as Id<"users">;

    const plan = await ctx.db
      .query("plans")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .first();

    return plan ? plan.planContent : "";
  },
});

// Upsert (create or update) a plan for a specific date
export const upsertPlan = mutation({
  args: { date: v.string(), planContent: v.string() },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject as Id<"users">;

    // Check if a plan already exists for this user/date
    const existingPlan = await ctx.db
      .query("plans")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .first();

    if (existingPlan) {
      // Update existing
      await ctx.db.patch(existingPlan._id, {
        planContent: args.planContent,
        updatedAt: Date.now(),
      });
    } else {
      // Create new
      await ctx.db.insert("plans", {
        date: args.date,
        userId,
        planContent: args.planContent,
        createdAt: Date.now(),
      });
    }
  },
});
