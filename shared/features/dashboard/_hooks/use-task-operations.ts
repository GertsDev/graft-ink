"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { TaskColorKey } from "../../../../convex/utils";

export function useTaskOperations() {
  const addTime = useMutation(api.timeEntries.add);
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  return {
    addTime: async (taskId: Id<"tasks">, duration: number, note?: string) => {
      return addTime({ taskId, duration, note });
    },

    createTask: async (title: string, topic?: string, color?: TaskColorKey) => {
      return createTask({ title, topic, color });
    },

    updateTask: async (taskId: Id<"tasks">, title: string, topic?: string) => {
      return updateTask({ taskId, title, topic });
    },

    updateTaskColor: async (taskId: Id<"tasks">, color?: TaskColorKey) => {
      return updateTask({ taskId, color: color ?? null });
    },

    toggleTaskPin: async (taskId: Id<"tasks">, pinned: boolean) => {
      return updateTask({ taskId, pinned });
    },

    deleteTask: async (taskId: Id<"tasks">) => {
      return deleteTask({ taskId });
    },
  };
}
