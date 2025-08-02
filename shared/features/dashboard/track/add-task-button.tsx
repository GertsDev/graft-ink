"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface AddTaskButtonProps {
  onAddTask: () => void;
  disabled?: boolean;
}

export function AddTaskButton({ onAddTask, disabled }: AddTaskButtonProps) {
  return (
    <div className="flex justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onAddTask}
              className="bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-95"
              disabled={disabled}
            >
              Add Task
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-muted/70">
            <p>
              {typeof window !== "undefined" &&
              navigator.userAgent.toLowerCase().includes("mac")
                ? "⌥"
                : "Alt"}{" "}
              + T
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}