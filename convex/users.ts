import { query } from "./_generated/server";
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
