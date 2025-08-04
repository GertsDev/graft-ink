"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import TaskCard from "../components/task-card";
import { type Doc } from "../../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Sparkles, Target, Coffee, Lightbulb, Zap, ArrowUp } from "lucide-react";

interface TasksGridProps {
  tasks: Doc<"tasks">[];
}

export function TasksGrid({ tasks }: TasksGridProps) {
  const [currentEmptyMessage, setCurrentEmptyMessage] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => b._creationTime - a._creationTime);
  }, [tasks]);
  
  // Rotate empty state messages
  const emptyMessages = [
    {
      title: "Your productivity canvas awaits!",
      subtitle: "Create your first task and watch the magic happen.",
      icon: Sparkles,
      color: "text-analyze-1"
    },
    {
      title: "Ready to build something amazing?",
      subtitle: "Every great journey starts with a single task.",
      icon: Rocket,
      color: "text-analyze-2"
    },
    {
      title: "Time to turn ideas into action!",
      subtitle: "What's the first thing you want to accomplish?",
      icon: Lightbulb,
      color: "text-analyze-3"
    },
    {
      title: "Your future self will thank you!",
      subtitle: "Start tracking time and unlock your potential.",
      icon: Target,
      color: "text-analyze-4"
    }
  ];
  
  // Show keyboard hint after a delay
  useEffect(() => {
    if (tasks.length === 0) {
      const timer = setTimeout(() => setShowHint(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [tasks.length]);
  
  // Rotate messages every 4 seconds
  useEffect(() => {
    if (tasks.length === 0) {
      const interval = setInterval(() => {
        setCurrentEmptyMessage((prev) => (prev + 1) % emptyMessages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [tasks.length, emptyMessages.length]);

  if (tasks.length === 0) {
    const currentMessage = emptyMessages[currentEmptyMessage];
    const MessageIcon = currentMessage.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-analyze-1/5 dark:from-card dark:to-analyze-1/10">
          <CardContent className="p-12 text-center">
            {/* Floating background decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-4 left-4 text-analyze-2/20"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
              >
                <Coffee className="h-6 w-6" />
              </motion.div>
              
              <motion.div
                className="absolute top-8 right-8 text-analyze-3/20"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3.5,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Zap className="h-5 w-5" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-4 left-8 text-analyze-4/20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4.5,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <Target className="h-4 w-4" />
              </motion.div>
            </div>
            
            {/* Main icon with animation */}
            <motion.div
              className={`inline-block mb-6 ${currentMessage.color}`}
              key={currentEmptyMessage} // Re-trigger animation on message change
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
            >
              <MessageIcon className="h-16 w-16" />
            </motion.div>
            
            {/* Animated text content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEmptyMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <h3 className="text-xl font-bold bg-gradient-to-r from-analyze-1 to-analyze-2 bg-clip-text text-transparent">
                  {currentMessage.title}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {currentMessage.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Keyboard shortcut hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-analyze-1/10 border border-analyze-1/20 rounded-full text-sm text-analyze-1 font-medium"
                >
                  <kbd className="px-2 py-1 bg-white/80 border border-analyze-1/30 rounded text-xs font-mono shadow-sm">
                    Alt + T
                  </kbd>
                  <span>for quick task creation</span>
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Subtle call to action */}
            <motion.div
              className="mt-6 text-xs text-muted-foreground/70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3, delay: 2 }}
            >
              Click the "Add Task" button to get started
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              layout: { duration: 0.3 }
            }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}