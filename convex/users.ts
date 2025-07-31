import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Get the current authenticated user's information
 */
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    // Use Convex Auth's built-in helper to get the current user ID
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    // Get the user document directly by ID
    const user = await ctx.db.get(userId);

    if (!user) {
      console.error("User document not found for authenticated user:", userId);
      return null;
    }

    return user;
  },
});

/**
 * Get user settings, returns default values if not set
 */
export const getUserSettings = query({
  args: {},
  returns: v.object({
    dayStartHour: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { dayStartHour: 0 }; // Default to midnight
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      dayStartHour: settings?.dayStartHour ?? 0, // Default to midnight
    };
  },
});

/**
 * Update user settings
 */
export const updateUserSettings = mutation({
  args: {
    dayStartHour: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Validate dayStartHour is between 0-23
    if (args.dayStartHour < 0 || args.dayStartHour > 23) {
      throw new Error("dayStartHour must be between 0 and 23");
    }

    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        dayStartHour: args.dayStartHour,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userSettings", {
        userId,
        dayStartHour: args.dayStartHour,
        createdAt: Date.now(),
      });
    }

    return null;
  },
});
