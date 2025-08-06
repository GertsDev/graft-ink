import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

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

/**
 * Task color system - predefined palette for consistency
 */
export const TASK_COLORS = {
  // Warm colors
  coral: { name: 'Coral', hex: '#FF6B6B', bg: 'bg-red-100', text: 'text-red-800', accent: 'bg-red-500' },
  amber: { name: 'Amber', hex: '#FFB366', bg: 'bg-orange-100', text: 'text-orange-800', accent: 'bg-orange-500' },
  sunflower: { name: 'Sunflower', hex: '#FFD93D', bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'bg-yellow-500' },

  // Cool colors
  mint: { name: 'Mint', hex: '#6BCF7F', bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-500' },
  sky: { name: 'Sky', hex: '#4ECDC4', bg: 'bg-teal-100', text: 'text-teal-800', accent: 'bg-teal-500' },
  ocean: { name: 'Ocean', hex: '#45B7D1', bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' },
  lavender: { name: 'Lavender', hex: '#96CEB4', bg: 'bg-purple-100', text: 'text-purple-800', accent: 'bg-purple-500' },
  plum: { name: 'Plum', hex: '#FECA57', bg: 'bg-indigo-100', text: 'text-indigo-800', accent: 'bg-indigo-500' },

  // Neutral
  slate: { name: 'Slate', hex: '#74B9FF', bg: 'bg-gray-100', text: 'text-gray-800', accent: 'bg-gray-500' },
} as const;

export type TaskColorKey = keyof typeof TASK_COLORS;

/**
 * Get the default color for a new task
 */
export function getDefaultTaskColor(): TaskColorKey {
  return 'slate';
}

/**
 * Validate if a color key exists in our palette
 */
export function isValidTaskColor(color: string): color is TaskColorKey {
  return color in TASK_COLORS;
}

/**
 * Get color info by key, with fallback to default
 */
export function getTaskColorInfo(color: string) {
  if (isValidTaskColor(color)) {
    return TASK_COLORS[color];
  }
  return TASK_COLORS[getDefaultTaskColor()];
}

/**
 * Convex validator for task colors
 */
export const taskColorValidator = v.union(
  v.literal('coral'),
  v.literal('amber'),
  v.literal('sunflower'),
  v.literal('mint'),
  v.literal('sky'),
  v.literal('ocean'),
  v.literal('lavender'),
  v.literal('plum'),
  v.literal('slate')
);
