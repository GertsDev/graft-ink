"use client";

import { useState } from "react";
import { Palette, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
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
}

export function TaskColorPicker({ 
  taskId, 
  currentColor, 
  disabled = false, 
  size = "default",
  showLabel = false,
  onColorChange
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size={buttonSize}
              disabled={disabled || isLoading}
              className="relative transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={`Task color: ${currentColorInfo?.name || 'No color'}`}
            >
              <div className="relative flex items-center gap-1.5">
                {currentColorInfo ? (
                  <div
                    className="size-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: currentColorInfo.hex }}
                    aria-hidden="true"
                  />
                ) : (
                  <Palette className="size-4 text-muted-foreground" aria-hidden="true" />
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
          <p>{currentColorInfo ? `Change from ${currentColorInfo.name}` : "Set task color"}</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent 
        className="w-72 p-4" 
        align="start" 
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Task Color</h4>
            {currentColor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleColorSelect(undefined)}
                disabled={isLoading}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* No Color option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleColorSelect(undefined)}
              disabled={isLoading}
              className={`
                relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-md
                ${!currentColor 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-muted-foreground/30"
                }
              `}
              aria-label="No color"
            >
              <div className="size-6 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center">
                <X className="size-3 text-muted-foreground/60" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                None
              </span>
              {!currentColor && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 size-4 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="size-2.5 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>

            {/* Color options */}
            {Object.entries(TASK_COLORS).map(([key, color]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorSelect(key as TaskColorKey)}
                disabled={isLoading}
                className={`
                  relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-md
                  ${currentColor === key 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-muted-foreground/30"
                  }
                `}
                aria-label={`Set color to ${color.name}`}
              >
                <div
                  className="size-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium text-muted-foreground leading-tight text-center">
                  {color.name}
                </span>
                {currentColor === key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="size-2.5 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Colors help organize and visually distinguish your tasks.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}