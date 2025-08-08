"use client";

import { useState } from "react";
import { Palette, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { TASK_COLORS, TaskColorKey } from "../../../../convex/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useTaskOperations } from "../_hooks/use-task-operations";

interface TaskColorPickerProps {
  taskId?: Id<"tasks">; // Optional for creation mode
  currentColor?: TaskColorKey;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  onColorChange?: (color?: TaskColorKey) => void; // For creation mode
  onOpenChange?: (open: boolean) => void; // Notify parent when the popover opens/closes
}

export function TaskColorPicker({
  taskId,
  currentColor,
  disabled = false,
  size = "default",
  showLabel = false,
  onColorChange,
  onOpenChange,
}: TaskColorPickerProps) {
  const { updateTaskColor } = useTaskOperations();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCreationMode = !taskId && onColorChange;

  const handleColorSelect = async (color?: TaskColorKey) => {
    // Only skip if both values are the same (including both being undefined)
    if (color === currentColor) return; // No change needed

    if (isCreationMode && onColorChange) {
      // Creation mode - just call the callback
      onColorChange(color);
      setIsOpen(false);
      return;
    }

    if (!taskId) return; // Need taskId for update mode

    setIsLoading(true);
    try {
      await updateTaskColor(taskId, color);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update task color:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentColorInfo = () => {
    if (!currentColor) return null;
    return TASK_COLORS[currentColor];
  };

  const currentColorInfo = getCurrentColorInfo();
  const buttonSize = size === "sm" ? "icon" : size === "lg" ? "lg" : "icon";

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onOpenChange?.(open);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size={buttonSize}
              disabled={disabled || isLoading}
              className="relative transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={`Task color: ${currentColorInfo?.name || "No color"}`}
            >
              <div className="relative flex items-center gap-1.5">
                {currentColorInfo ? (
                  <div
                    className="size-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: currentColorInfo.hex }}
                    aria-hidden="true"
                  />
                ) : (
                  <Palette
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                  />
                )}
                {showLabel && (
                  <span className="text-xs font-medium">
                    {currentColorInfo?.name || "Color"}
                  </span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {currentColorInfo
              ? `Change from ${currentColorInfo.name}`
              : "Set task color"}
          </p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        className="border-none bg-transparent p-0 shadow-none"
        align="end"
        side="bottom"
        sideOffset={4}
      >
        <div className="bg-card/95 border-border/60 flex items-center gap-1.5 rounded-full border px-1.5 py-1">
          {/* None option */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleColorSelect(undefined)}
            disabled={isLoading}
            aria-label="No color"
            className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              !currentColor ? "ring-primary/80 ring-2" : ""
            }`}
          >
            <div className="border-muted-foreground/40 flex h-4 w-4 items-center justify-center rounded-full border border-dashed bg-transparent">
              <X className="text-muted-foreground/70 h-3 w-3" />
            </div>
          </motion.button>

          {/* Color options */}
          {Object.entries(TASK_COLORS).map(([key, color]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleColorSelect(key as TaskColorKey)}
              disabled={isLoading}
              aria-label={`Set color to ${color.name}`}
              className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full ${
                currentColor === key ? "ring-primary/80 ring-2" : ""
              }`}
            >
              <div
                className="h-4 w-4 rounded-full border border-white/70 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            </motion.button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
