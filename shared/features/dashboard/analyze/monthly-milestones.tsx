"use client";

import React from "react";
import { motion } from "motion/react";
import { Trophy, Target, Flame, Clock, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { formatTime } from "../_utils/format-utils";
import { type Milestone } from "./_types/analytics-types";

interface MonthlyMilestonesProps {
  milestones: Milestone[];
}

export function MonthlyMilestones({ milestones }: MonthlyMilestonesProps) {
  if (milestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Monthly Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No milestones achieved this month yet.</p>
            <p className="text-sm">Keep working towards your goals!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "time_milestone":
        return Clock;
      case "task_milestone":
        return Target;
      case "streak_milestone":
        return Flame;
      case "consistency_score":
        return Award;
      default:
        return Trophy;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case "time_milestone":
        return "from-blue-400 to-blue-600";
      case "task_milestone":
        return "from-green-400 to-green-600";
      case "streak_milestone":
        return "from-orange-400 to-red-600";
      case "consistency_score":
        return "from-purple-400 to-purple-600";
      default:
        return "from-analyze-3 to-analyze-5";
    }
  };

  const getMilestoneTitle = (milestone: Milestone) => {
    switch (milestone.type) {
      case "time_milestone":
        return `${formatTime(milestone.value)} milestone`;
      case "task_milestone":
        return milestone.taskTitle ? `Completed ${milestone.taskTitle}` : "Task completed";
      case "streak_milestone":
        return `${milestone.value} day streak`;
      case "consistency_score":
        return `${milestone.value}% consistency`;
      default:
        return "Milestone achieved";
    }
  };

  const getMilestoneDescription = (milestone: Milestone) => {
    const date = new Date(milestone.achievedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    switch (milestone.type) {
      case "time_milestone":
        return `Reached on ${date}`;
      case "task_milestone":
        return `Completed on ${date}`;
      case "streak_milestone":
        return `Achieved on ${date}`;
      case "consistency_score":
        return `Reached on ${date}`;
      default:
        return `Achieved on ${date}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Monthly Milestones ({milestones.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((milestone, index) => {
            const Icon = getMilestoneIcon(milestone.type);
            const colorClass = getMilestoneColor(milestone.type);
            
            return (
              <motion.div
                key={milestone._id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className={`
                  relative p-4 rounded-lg bg-gradient-to-br ${colorClass} 
                  text-white shadow-md overflow-hidden
                `}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
                  <Icon className="h-16 w-16" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight mb-1">
                        {getMilestoneTitle(milestone)}
                      </h4>
                      <p className="text-white/80 text-xs">
                        {getMilestoneDescription(milestone)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 -top-2 -bottom-2"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.1 + 0.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}