import { Sprout, TreePine, Crown } from "lucide-react";
import type { GrowthStage } from "../../../components/visual-stories/types";

export function getTaskGrowthStage(totalMinutes: number): GrowthStage {
  if (totalMinutes === 0) {
    return {
      icon: Sprout,
      stage: "seed",
      color: "text-gray-400",
      bgColor: "bg-gray-50",
      message: "Ready to sprout"
    };
  }
  
  if (totalMinutes < 60) {
    return {
      icon: Sprout,
      stage: "sprout",
      color: "text-green-500",
      bgColor: "bg-green-50",
      message: "First growth"
    };
  }
  
  if (totalMinutes < 180) {
    return {
      icon: TreePine,
      stage: "sapling",
      color: "text-green-600",
      bgColor: "bg-green-100",
      message: "Growing strong"
    };
  }
  
  if (totalMinutes < 360) {
    return {
      icon: TreePine,
      stage: "tree",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      message: "Flourishing"
    };
  }
  
  return {
    icon: Crown,
    stage: "master",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    message: "Mastery achieved"
  };
}

export function getProgressMilestone(progress: number) {
  if (progress === 0) return { message: "Dawn breaks - your journey begins", stage: "start" };
  if (progress < 0.25) return { message: "First steps through the forest", stage: "early" };
  if (progress < 0.5) return { message: "Climbing the foothills", stage: "climbing" };
  if (progress < 0.75) return { message: "Ascending the peaks", stage: "ascending" };
  if (progress < 1) return { message: "Summit in sight!", stage: "nearSummit" };
  return { message: "Summit conquered! New horizons await", stage: "victory" };
}