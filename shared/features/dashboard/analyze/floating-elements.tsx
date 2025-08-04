"use client";

import React from "react";
import { motion } from "motion/react";

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export function FloatingElements({ count = 6, className = "" }: FloatingElementsProps) {
  const elements = ['✨', '⭐', '💫', '🌟', '✺', '○'];
  
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          {elements[i % elements.length]}
        </motion.div>
      ))}
    </div>
  );
}