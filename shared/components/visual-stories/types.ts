import { LucideIcon } from "lucide-react";

export interface GrowthStage {
  icon: LucideIcon;
  stage: "seed" | "sprout" | "sapling" | "tree" | "master";
  color: string;
  bgColor: string;
  message: string;
}

export interface Milestone {
  icon: LucideIcon;
  message: string;
  stage: "start" | "early" | "climbing" | "ascending" | "nearSummit" | "victory";
}

export interface CelebrationConfig {
  icon: LucideIcon;
  title: string;
  message: string;
  color: string;
  particles: number;
  animation: "bounce" | "celebrate" | "pulse" | "explode" | "burst";
}

export type CelebrationType = 
  | "timeAdded" 
  | "taskCompleted" 
  | "streak" 
  | "milestone" 
  | "goalReached";

export interface StoryInsights {
  totalTime: number;
  avgDaily: number;
  bestDay: { total: number; date: string };
  streak: number;
  momentum: number;
  consistency: number;
}

export interface EmptyStateType {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  actionText: string;
  visualElements: Array<{
    icon: LucideIcon;
    delay: number;
    message: string;
  }>;
}