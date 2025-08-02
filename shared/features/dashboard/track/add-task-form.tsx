"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

interface AddTaskFormProps {
  onCreateTask: (title: string, topic?: string) => Promise<void>;
  onCancel: () => void;
}

export function AddTaskForm({ onCreateTask, onCancel }: AddTaskFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await onCreateTask(newTaskTitle.trim(), newTaskTopic.trim() || undefined);
      setNewTaskTitle("");
      setNewTaskTopic("");
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

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 flex justify-end duration-300">
      <CardHeader>
        <h3 className="text-lg font-semibold">Create New Task</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="focus:ring-ring/20 focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-200 focus:ring-2"
            autoFocus
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Topic (optional)"
            value={newTaskTopic}
            onChange={(e) => setNewTaskTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            className="focus:ring-ring/20 focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-200 focus:ring-2"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateTask}
            disabled={!newTaskTitle.trim() || isCreating}
            className="transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {isCreating ? "Creating..." : "Create Task"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}