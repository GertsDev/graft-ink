"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, TrendingUp, Target } from "lucide-react";

interface AnalyticsCelebrationsProps {
  trigger: "month_complete" | "streak_milestone" | "consistency_boost" | "time_milestone";
  data?: {
    value?: number;
    percentage?: number;
    streak?: number;
  };
  onComplete?: () => void;
}

export function AnalyticsCelebrations({ 
  trigger, 
  data = {}, 
  onComplete = () => {} 
}: AnalyticsCelebrationsProps) {
  const [isVisible, setIsVisible] = useState(true);

  const celebrationConfig = {
    month_complete: {
      icon: Trophy,
      title: "Month Complete!",
      message: "What an incredible journey this month",
      color: "from-yellow-400 to-orange-500",
      particles: 20,
    },
    streak_milestone: {
      icon: Target,
      title: `${data.streak || 7} Day Streak!`,
      message: "Consistency is your superpower",
      color: "from-purple-400 to-pink-500",
      particles: 15,
    },
    consistency_boost: {
      icon: TrendingUp,
      title: "Consistency Boost!",
      message: `${data.percentage || 85}% consistency this month`,
      color: "from-green-400 to-emerald-500", 
      particles: 12,
    },
    time_milestone: {
      icon: Sparkles,
      title: "Time Milestone!",
      message: `${data.value || 100} hours tracked`,
      color: "from-blue-400 to-cyan-500",
      particles: 18,
    },
  }[trigger];

  const Icon = celebrationConfig.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3500);

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
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Celebration burst */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Particles */}
            <div className="absolute inset-0">
              {Array.from({ length: celebrationConfig.particles }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: `hsl(${(i * 360) / celebrationConfig.particles}, 70%, 60%)`,
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ 
                    scale: 0, 
                    x: 0, 
                    y: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos((i / celebrationConfig.particles) * Math.PI * 2) * 100,
                    y: Math.sin((i / celebrationConfig.particles) * Math.PI * 2) * 100,
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Main celebration card */}
            <motion.div
              className={`
                relative bg-gradient-to-br ${celebrationConfig.color} 
                text-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4
                overflow-hidden
              `}
              initial={{ y: 50, rotateX: -90 }}
              animate={{ y: 0, rotateX: 0 }}
              exit={{ y: -50, rotateX: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              <div className="relative z-10 text-center">
                <motion.div
                  className="flex justify-center mb-4"
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Icon className="w-8 h-8" />
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

                {/* Floating hearts */}
                <div className="absolute -inset-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-white/40"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [-20, -40, -60],
                      }}
                      transition={{ 
                        duration: 3,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}