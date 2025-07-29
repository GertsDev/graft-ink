import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Utility to obtain the current authenticated user id.
 * Throws if the user is not authenticated. Prefer this in mutations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserOrThrow(ctx: any): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId as Id<"users">;
}
