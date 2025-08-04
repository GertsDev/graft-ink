"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";
import { motion } from "motion/react";
import { Clock, Zap, Target } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <motion.div 
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Daily Summary Skeleton */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="text-analyze-1"
              >
                <Clock className="h-6 w-6" />
              </motion.div>
              <div className="relative">
                <div className="bg-gradient-to-r from-analyze-1/30 to-analyze-2/30 h-8 w-40 rounded" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="bg-gradient-to-r from-analyze-2/30 to-analyze-3/30 h-3 w-full rounded-full" />
              <motion.div
                className="absolute top-0 left-0 h-3 w-20 bg-gradient-to-r from-analyze-1 to-analyze-2 rounded-full"
                animate={{ x: [0, "calc(100vw - 80px)", 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Task Button Skeleton */}
      <motion.div 
        className="flex justify-end"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-analyze-3/30 to-analyze-4/30 h-10 w-32 rounded flex items-center justify-center" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-analyze-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
          >
            <Target className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>

      {/* Tasks Grid Skeleton */}
      <motion.div 
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg border"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="bg-gradient-to-br from-analyze-1/10 via-analyze-2/10 to-analyze-3/10 h-32 p-4">
              {/* Header skeleton */}
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-analyze-1/30 to-analyze-2/30 h-4 w-24 rounded" />
                  <div className="bg-gradient-to-r from-analyze-2/20 to-analyze-3/20 h-3 w-16 rounded" />
                </div>
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 3, delay: index * 0.5 }}
                  className="text-analyze-2/40"
                >
                  <Zap className="h-4 w-4" />
                </motion.div>
              </div>
              
              {/* Buttons skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {[1, 2, 3].map((btn) => (
                    <motion.div
                      key={btn}
                      className="bg-gradient-to-r from-analyze-3/30 to-analyze-4/30 h-6 w-12 rounded"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2, 
                        delay: index * 0.2 + btn * 0.1 
                      }}
                    />
                  ))}
                </div>
                <div className="text-right space-y-1">
                  <div className="bg-gradient-to-r from-analyze-4/30 to-analyze-5/30 h-3 w-16 rounded" />
                  <div className="bg-gradient-to-r from-analyze-5/20 to-analyze-1/20 h-3 w-12 rounded" />
                </div>
              </div>
            </div>
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "linear",
                delay: index * 0.3
              }}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Playful loading message */}
      <motion.div
        className="text-center text-sm text-muted-foreground mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Gathering your productivity magic...
        </motion.span>
      </motion.div>
    </motion.div>
  );
}