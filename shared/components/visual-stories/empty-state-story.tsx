"use client";

import React from "react";
import { motion } from "motion/react";
import { Plus, Compass, Map, Sparkles, Target } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateStoryProps {
  type: "tasks" | "timeEntries" | "plans";
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyStateStory({ type, onAction, actionLabel }: EmptyStateStoryProps) {
  const getStoryContent = () => {
    switch (type) {
      case "tasks":
        return {
          title: "Your Adventure Awaits",
          subtitle: "Every great journey begins with a single step",
          description: "Create your first task and watch your productivity garden grow. Each task is a seed of potential, waiting to flourish into accomplished goals.",
          icon: Compass,
          actionText: actionLabel || "Plant Your First Seed",
          visualElements: [
            { icon: Target, delay: 0.2, message: "Set your destination" },
            { icon: Map, delay: 0.4, message: "Chart your course" },
            { icon: Sparkles, delay: 0.6, message: "Discover your potential" },
          ]
        };
      case "timeEntries":
        return {
          title: "Time Stories Untold",
          subtitle: "Your productivity narrative is waiting to be written",
          description: "Start tracking time to see the beautiful story of your focus and dedication unfold. Each minute tracked becomes part of your achievement chronicle.",
          icon: Sparkles,
          actionText: actionLabel || "Begin Your Story",
          visualElements: [
            { icon: Target, delay: 0.2, message: "Focus your energy" },
            { icon: Compass, delay: 0.4, message: "Navigate your day" },
            { icon: Map, delay: 0.6, message: "Map your progress" },
          ]
        };
      case "plans":
        return {
          title: "Tomorrow's Canvas",
          subtitle: "Paint your intentions with purpose",
          description: "Planning is dreaming with a deadline. Sketch out your ideal day and transform tomorrow from chance into choice.",
          icon: Map,
          actionText: actionLabel || "Design Tomorrow",
          visualElements: [
            { icon: Compass, delay: 0.2, message: "Find your direction" },
            { icon: Target, delay: 0.4, message: "Aim with precision" },
            { icon: Sparkles, delay: 0.6, message: "Manifest your vision" },
          ]
        };
      default:
        return {
          title: "Ready to Begin",
          subtitle: "Your journey starts here",
          description: "Take the first step towards intentional productivity.",
          icon: Compass,
          actionText: "Get Started",
          visualElements: []
        };
    }
  };

  const story = getStoryContent();
  const MainIcon = story.icon;

  return (
    <div className="relative min-h-[400px] flex items-center justify-center p-8">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-amber-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-700/50 rounded-xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-analyze-2/30 rounded-full"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Main icon with breathing animation */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <MainIcon className="w-16 h-16 text-analyze-2" />
            <motion.div
              className="absolute inset-0 w-16 h-16 border-2 border-analyze-2/30 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </div>
        </motion.div>

        {/* Story content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-analyze-1 to-analyze-2 bg-clip-text text-transparent">
            {story.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-4 font-medium">
            {story.subtitle}
          </p>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            {story.description}
          </p>
        </motion.div>

        {/* Visual story elements */}
        <div className="flex justify-center gap-6 mb-8">
          {story.visualElements.map((element, index) => {
            const ElementIcon = element.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: element.delay, duration: 0.6 }}
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-analyze-1/10 to-analyze-2/10 border border-analyze-1/20">
                  <ElementIcon className="w-5 h-5 text-analyze-1" />
                </div>
                <span className="text-xs text-muted-foreground text-center max-w-[80px]">
                  {element.message}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action */}
        {onAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={onAction}
              size="lg"
              className="bg-gradient-to-r from-analyze-1 to-analyze-2 hover:from-analyze-2 hover:to-analyze-3 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              {story.actionText}
            </Button>
          </motion.div>
        )}

        {/* Inspirational quote */}
        <motion.div
          className="mt-8 p-4 bg-gradient-to-r from-analyze-1/5 to-analyze-2/5 rounded-lg border border-analyze-1/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-xs italic text-muted-foreground">
            "The secret to getting ahead is getting started." — Mark Twain
          </p>
        </motion.div>
      </div>
    </div>
  );
}