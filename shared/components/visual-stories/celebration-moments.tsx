"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Crown, 
  Award, 
  Trophy, 
  Star,
  Target,
  Flame
} from "lucide-react";

interface CelebrationMomentsProps {
  trigger: "timeAdded" | "taskCompleted" | "streak" | "milestone" | "goalReached";
  value?: number;
  milestone?: string;
  onComplete: () => void;
}

export function CelebrationMoments({ 
  trigger, 
  value, 
  milestone, 
  onComplete 
}: CelebrationMomentsProps) {
  const [isVisible, setIsVisible] = useState(true);

  const celebrationConfig = useMemo(() => {
    switch (trigger) {
      case "timeAdded":
        return {
          icon: Zap,
          title: "Time Captured!",
          message: value ? `+${value}m added to your journey` : "Time well spent",
          color: "from-blue-400 to-cyan-600",
          particles: 8
        };
      case "taskCompleted":
        return {
          icon: Target,
          title: "Task Complete!",
          message: milestone || "Another step forward",
          color: "from-green-400 to-emerald-600",
          particles: 12
        };
      case "streak":
        return {
          icon: Flame,
          title: `${value || 1} Day Streak!`,
          message: "Consistency is your superpower",
          color: "from-orange-400 to-red-600",
          particles: 15
        };
      case "milestone":
        return {
          icon: Crown,
          title: "Milestone Reached!",
          message: milestone || "You're building something amazing",
          color: "from-purple-400 to-pink-600",
          particles: 20
        };
      case "goalReached":
        return {
          icon: Award,
          title: "Goal Achieved!",
          message: "Today's target conquered",
          color: "from-emerald-400 to-teal-600",
          particles: 25
        };
      default:
        return {
          icon: Star,
          title: "Great Work!",
          message: "Keep up the momentum",
          color: "from-indigo-400 to-indigo-600",
          particles: 10
        };
    }
  }, [trigger, value, milestone]);

  const CelebrationIcon = celebrationConfig.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Main celebration card */}
          <motion.div
            className={`relative bg-gradient-to-br ${celebrationConfig.color} text-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4`}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Particle effects */}
            <div className="absolute inset-0">
              {Array.from({ length: celebrationConfig.particles }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                  style={{
                    top: '50%',
                    left: '50%',
                    x: Math.cos((i / celebrationConfig.particles) * Math.PI * 2) * 50,
                    y: Math.sin((i / celebrationConfig.particles) * Math.PI * 2) * 50,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                />
              ))}
            </div>

            {/* Celebration content */}
            <div className="relative z-10 text-center">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <CelebrationIcon className="w-8 h-8" />
                </div>
              </motion.div>

              <motion.h2
                className="text-xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {celebrationConfig.title}
              </motion.h2>

              <motion.p
                className="text-white/90 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {celebrationConfig.message}
              </motion.p>

              {/* Progress ring for milestones */}
              {(trigger === "milestone" || trigger === "goalReached") && (
                <motion.div
                  className="mt-4 mx-auto w-16 h-16 rounded-full border-4 border-white/30"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.7, duration: 1 }}
                >
                  <motion.div
                    className="w-full h-full rounded-full border-4 border-white border-r-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}