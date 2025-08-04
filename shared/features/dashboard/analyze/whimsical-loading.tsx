"use client";

import React from "react";
import { motion } from "motion/react";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";

export function WhimsicalLoading() {
  const icons = [BarChart3, Calendar, TrendingUp];
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Floating icons */}
        {icons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: Math.sin((index * 2 * Math.PI) / 3) * 40,
              left: Math.cos((index * 2 * Math.PI) / 3) * 40,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-6 w-6 text-analyze-3" />
          </motion.div>
        ))}
        
        {/* Central loading spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-analyze-2/30 border-t-analyze-3 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <motion.p
        className="mt-6 text-gray-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Crunching your amazing data...
      </motion.p>
      
      {/* Floating sparkles */}
      <div className="relative w-full h-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-40"
            style={{
              left: `${20 + i * 15}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}