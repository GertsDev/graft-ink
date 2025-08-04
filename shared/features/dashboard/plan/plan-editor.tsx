"use client";

import React, { useState, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { Feather, Lightbulb, Target, Sparkles, BookOpen } from "lucide-react";

interface PlanEditorProps {
  planContent: string;
  selectedDate: Date;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PlanEditor({ planContent, selectedDate, onChange }: PlanEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showWordCountCelebration, setShowWordCountCelebration] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Format date for display
  const formatDisplayDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };
  
  // Inspirational placeholders that rotate
  const placeholders = [
    `What's the most important thing to accomplish ${formatDisplayDate(selectedDate).toLowerCase()}?`,
    `What three outcomes would make ${formatDisplayDate(selectedDate).toLowerCase()} a success?`,
    `What energy do you want to bring to ${formatDisplayDate(selectedDate).toLowerCase()}?`,
    `What's one thing you're excited to work on ${formatDisplayDate(selectedDate).toLowerCase()}?`,
    `How do you want to feel at the end of ${formatDisplayDate(selectedDate).toLowerCase()}?`,
    `What would make ${formatDisplayDate(selectedDate).toLowerCase()} meaningful?`
  ];
  
  // Update word count when content changes
  useEffect(() => {
    const words = planContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const previousCount = wordCount;
    setWordCount(words);
    
    // Celebration for writing milestones
    if (words > 0 && previousCount === 0) {
      // First words written
    } else if (words >= 50 && previousCount < 50) {
      setShowWordCountCelebration(true);
      setTimeout(() => setShowWordCountCelebration(false), 2000);
    } else if (words >= 100 && previousCount < 100) {
      setShowWordCountCelebration(true);
      setTimeout(() => setShowWordCountCelebration(false), 2000);
    }
  }, [planContent, wordCount]);
  
  // Rotate placeholders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [placeholders.length]);
  
  // Track typing activity
  useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timeout);
  }, [planContent]);
  
  // Get encouraging message based on word count
  const getEncouragingMessage = () => {
    if (wordCount === 0) return { text: "Start with just one thought...", icon: Feather, color: "text-analyze-2" };
    if (wordCount >= 100) return { text: "Your thoughts are flowing beautifully!", icon: Sparkles, color: "text-analyze-1" };
    if (wordCount >= 50) return { text: "Great momentum! Keep the ideas coming.", icon: Lightbulb, color: "text-analyze-3" };
    if (wordCount >= 20) return { text: "You're building something meaningful.", icon: Target, color: "text-analyze-4" };
    return { text: "Every word counts. Keep going!", icon: BookOpen, color: "text-analyze-5" };
  };
  
  const encouragement = getEncouragingMessage();
  const EncouragementIcon = encouragement.icon;

  return (
    <div className="relative">
      {/* Typing indicator */}
      <AnimatePresence>
        {isTyping && planContent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-analyze-2 shadow-sm border"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-2 w-2 rounded-full bg-analyze-2"
            />
            Writing...
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Word count celebration */}
      <AnimatePresence>
        {showWordCountCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-analyze-2/90 to-analyze-3/90 backdrop-blur-sm px-6 py-3 text-white font-bold shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            {wordCount >= 100 ? "Century achieved!" : "Halfway there!"}
            <Target className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <textarea
          className="focus:border-analyze-2 text-md sm:text-md min-h-[500px] w-full resize-none rounded-md border-2 border-gray-300 p-4 text-base leading-relaxed font-light focus:outline-none focus:ring-2 focus:ring-analyze-2/20 transition-all duration-200"
          id="plan"
          value={planContent}
          onChange={onChange}
          placeholder={placeholders[currentPlaceholder]}
          autoFocus
        />
        
        {/* Subtle floating decoration */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -2, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
            className="text-analyze-2/30"
          >
            <Feather className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Status bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-center justify-between text-sm"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className={`flex items-center gap-1 ${encouragement.color} font-medium`}
            animate={wordCount > 0 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <EncouragementIcon className="h-4 w-4" />
            {encouragement.text}
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Word count with milestone colors */}
          <motion.span 
            className={`font-mono text-xs ${
              wordCount >= 100 ? "text-analyze-1 font-bold" :
              wordCount >= 50 ? "text-analyze-3 font-medium" :
              wordCount > 0 ? "text-analyze-5" :
              "text-muted-foreground"
            }`}
            animate={wordCount > 0 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.2 }}
            key={wordCount} // Re-trigger animation on count change
          >
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </motion.span>
          
          {/* Progress indicator */}
          {wordCount > 0 && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (wordCount / 100) * 100)}%` }}
              className="h-1 bg-gradient-to-r from-analyze-5 to-analyze-1 rounded-full"
              style={{ width: "40px" }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}