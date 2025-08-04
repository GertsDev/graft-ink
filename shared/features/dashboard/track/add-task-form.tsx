"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Coffee, Rocket, Brain, Target } from "lucide-react";

interface AddTaskFormProps {
  onCreateTask: (title: string, topic?: string) => Promise<void>;
  onCancel: () => void;
}

export function AddTaskForm({ onCreateTask, onCancel }: AddTaskFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Rotating placeholder suggestions
  const taskSuggestions = [
    "Write blog post about...",
    "Review project documentation",
    "Call with client about...",
    "Research new framework",
    "Plan next sprint",
    "Update project roadmap",
    "Code review session",
    "Design mockups for..."
  ];
  
  const topicSuggestions = [
    "Development",
    "Design",
    "Research",
    "Planning",
    "Meetings",
    "Learning"
  ];
  
  // Rotate placeholders every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % taskSuggestions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [taskSuggestions.length]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await onCreateTask(newTaskTitle.trim(), newTaskTopic.trim() || undefined);
      
      // Show success animation
      setShowSuccess(true);
      
      // Clear form after short delay
      setTimeout(() => {
        setNewTaskTitle("");
        setNewTaskTopic("");
        setShowSuccess(false);
      }, 800);
      
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setNewTaskTitle("");
    setNewTaskTopic("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateTask();
    }
  };

  // Get encouraging button text based on input
  const getButtonText = () => {
    if (isCreating) return "Creating magic...";
    if (showSuccess) return "Created!";
    if (!newTaskTitle.trim()) return "Create Task";
    if (newTaskTitle.trim().length > 20) return "Let's build this!";
    return "Make it happen!";
  };
  
  const getButtonIcon = () => {
    if (showSuccess) return Sparkles;
    if (isCreating) return Brain;
    if (newTaskTitle.includes("coffee") || newTaskTitle.includes("break")) return Coffee;
    if (newTaskTitle.includes("launch") || newTaskTitle.includes("deploy")) return Rocket;
    return Target;
  };
  
  const ButtonIcon = getButtonIcon();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-white to-analyze-1/5 dark:from-card dark:to-analyze-1/10 flex justify-end">
        {/* Success overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-analyze-2/20 to-analyze-3/20 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-lg font-bold text-analyze-2 shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                Task created! Ready to track time!
                <Rocket className="h-5 w-5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      <CardHeader>
        <motion.h3 
          className="text-lg font-semibold bg-gradient-to-r from-analyze-1 to-analyze-2 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create New Task
        </motion.h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.input
            type="text"
            placeholder={taskSuggestions[currentPlaceholder]}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="focus:ring-ring/20 focus:border-analyze-2 w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-analyze-2/20 focus:border-analyze-2"
            autoFocus
            whileFocus={{ scale: 1.02 }}
            key={currentPlaceholder} // Re-render when placeholder changes
          />
          {/* Typing indicator */}
          {newTaskTitle.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1 text-xs text-analyze-2 font-medium flex items-center gap-1"
            >
              <Target className="h-3 w-3" />
              {newTaskTitle.length < 5 ? "Keep going..." : 
               newTaskTitle.length < 15 ? "Looking good!" : 
               "Perfect length!"}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.input
            type="text"
            placeholder={`e.g., ${topicSuggestions[currentPlaceholder % topicSuggestions.length]}`}
            value={newTaskTopic}
            onChange={(e) => setNewTaskTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            className="focus:ring-ring/20 focus:border-analyze-3 w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-analyze-3/20 focus:border-analyze-3"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreateTask}
              disabled={!newTaskTitle.trim() || isCreating}
              className={`relative overflow-hidden transition-all duration-200 disabled:hover:scale-100 ${
                showSuccess ? "bg-analyze-2 text-white" : 
                isCreating ? "bg-analyze-3 text-white" : ""
              }`}
            >
              {/* Button background animation */}
              {(isCreating || showSuccess) && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
              )}
              
              <span className="relative flex items-center gap-2">
                <ButtonIcon className={`h-4 w-4 ${
                  isCreating ? "animate-spin" : 
                  showSuccess ? "animate-bounce" : ""
                }`} />
                {getButtonText()}
              </span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="transition-all duration-200 hover:border-analyze-1 hover:text-analyze-1"
            >
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
    </motion.div>
  );
}