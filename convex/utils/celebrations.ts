import { GenericId } from "convex/values";

// Celebration utility functions for consistent behavior across the app

export interface CelebrationTrigger {
  type: "time_added" | "milestone_reached" | "streak_achieved" | "goal_completed";
  value?: number;
  milestone?: {
    type: "time_milestone" | "streak_milestone" | "task_milestone";
    value: number;
    message?: string;
  };
}

// Debounce celebrations to prevent spam
const CELEBRATION_COOLDOWN = 5000; // 5 seconds

export function shouldTriggerCelebration(
  lastCelebration: number | undefined,
  now: number
): boolean {
  return !lastCelebration || (now - lastCelebration) > CELEBRATION_COOLDOWN;
}

// Calculate celebration priority (higher = more important)
export function getCelebrationPriority(trigger: CelebrationTrigger): number {
  switch (trigger.type) {
    case "milestone_reached":
      return trigger.milestone?.type === "streak_milestone" ? 100 : 80;
    case "streak_achieved":
      return 90;
    case "goal_completed":
      return 70;
    case "time_added":
      return 10;
    default:
      return 0;
  }
}

// Generate celebration messages
export function getCelebrationMessage(trigger: CelebrationTrigger): {
  title: string;
  message: string;
  icon: string;
} {
  switch (trigger.type) {
    case "time_added":
      return {
        title: "Time Captured!",
        message: `+${trigger.value}m added to your journey`,
        icon: "zap",
      };
    case "milestone_reached":
      if (trigger.milestone?.type === "time_milestone") {
        const hours = Math.floor((trigger.milestone.value || 0) / 60);
        return {
          title: "Milestone Reached!",
          message: `${hours} hour${hours !== 1 ? 's' : ''} of focused work`,
          icon: "crown",
        };
      }
      return {
        title: "Achievement Unlocked!",
        message: trigger.milestone?.message || "You're making great progress",
        icon: "award",
      };
    case "streak_achieved":
      return {
        title: `${trigger.value} Day Streak!`,
        message: "Consistency is your superpower",
        icon: "trophy",
      };
    case "goal_completed":
      return {
        title: "Goal Achieved!",
        message: "Today's target conquered",
        icon: "target",
      };
    default:
      return {
        title: "Great Work!",
        message: "Keep up the momentum",
        icon: "star",
      };
  }
}

// Task growth stage utilities
export interface GrowthStage {
  stage: "seed" | "sprout" | "sapling" | "tree" | "forest";
  message: string;
  color: string;
  bgColor: string;
  nextThreshold?: number;
}

export function getTaskGrowthStage(totalMinutes: number): GrowthStage {
  if (totalMinutes === 0) {
    return {
      stage: "seed",
      message: "Ready to sprout",
      color: "text-gray-400",
      bgColor: "bg-gray-50",
      nextThreshold: 30,
    };
  }
  
  if (totalMinutes < 60) {
    return {
      stage: "sprout",
      message: "First growth",
      color: "text-green-500",
      bgColor: "bg-green-50",
      nextThreshold: 60,
    };
  }
  
  if (totalMinutes < 180) {
    return {
      stage: "sapling",
      message: "Growing strong",
      color: "text-green-600",
      bgColor: "bg-green-100",
      nextThreshold: 180,
    };
  }
  
  if (totalMinutes < 360) {
    return {
      stage: "tree",
      message: "Flourishing",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      nextThreshold: 360,
    };
  }
  
  return {
    stage: "forest",
    message: "Mastery achieved",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  };
}

// Analytics narrative generation
export function generateProgressNarrative(data: {
  totalHours: number;
  streakCount: number;
  consistencyScore: number;
  recentTrend: "up" | "down" | "stable";
}): {
  phase: "beginning" | "building" | "flourishing" | "mastery";
  story: string;
  nextGoal: string;
} {
  const { totalHours, streakCount, consistencyScore } = data;
  
  if (totalHours < 10) {
    return {
      phase: "beginning",
      story: "Every master was once a beginner. You're planting the seeds of expertise, one focused session at a time.",
      nextGoal: "Build your first 10 hours of practice",
    };
  }
  
  if (totalHours < 50) {
    return {
      phase: "building",
      story: `With ${Math.floor(totalHours)} hours under your belt, you're building real momentum. Each session strengthens your foundation.`,
      nextGoal: streakCount < 7 ? "Establish a 7-day streak" : "Reach 50 hours of practice",
    };
  }
  
  if (totalHours < 150) {
    return {
      phase: "flourishing",
      story: `${Math.floor(totalHours)} hours of dedication have transformed you. You're not just practicing—you're flourishing in your craft.`,
      nextGoal: consistencyScore < 80 ? "Maintain 80% weekly consistency" : "Reach expert level (150+ hours)",
    };
  }
  
  return {
    phase: "mastery",
    story: `With ${Math.floor(totalHours)} hours of deliberate practice, you've entered the realm of mastery. Your journey continues toward even greater heights.`,
    nextGoal: "Set new challenges and expand your expertise",
  };
}

// Real-time subscription helpers
export function getOptimizedIndexQuery(
  table: string,
  index: string,
  userId: GenericId<"users">,
  additionalFilters?: (query: unknown) => unknown
) {
  // This is a pattern for consistent, indexed queries
  // Always use indexes instead of filters for better performance
  return {
    table,
    index,
    userId,
    filters: additionalFilters,
  };
}