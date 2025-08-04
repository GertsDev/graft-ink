"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
  delay?: number;
}

export function AnimatedCounter({ 
  value, 
  duration = 1000,
  format = (v) => v.toString(),
  className = "",
  delay = 0
}: AnimatedCounterProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });
  
  const display = useTransform(spring, (latest) => format(Math.round(latest)));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated) {
        spring.set(value);
        setHasAnimated(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, spring, hasAnimated, delay]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000 }}
    >
      {hasAnimated ? display : format(0)}
    </motion.span>
  );
}