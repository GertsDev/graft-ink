"use client";

import {
  createContext,
  useContext,
  useOptimistic,
  useTransition,
  startTransition,
} from "react";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { useTimeDurations } from "../../hooks/use-time-durations";

export interface TaskWithTime {
  _id: Id<"tasks">;
  _creationTime: number;
  id: string;
  title: string;
  topic?: string;
  subtopic?: string;
  createdAt: number;
  userId: Id<"users">;
  totalTime?: number;
  todayTime?: number;
}

type OptimisticAction =
  | { type: "addTime"; taskId: string; duration: number }
  | { type: "updateTask"; taskId: Id<"tasks">; title: string; topic?: string }
  | { type: "deleteTask"; taskId: Id<"tasks"> }
  | { type: "addTask"; task: TaskWithTime };

interface TrackContextValue {
  tasks: TaskWithTime[];
  optimisticTasks: TaskWithTime[];
  setOptimistic: (action: OptimisticAction) => void;
  isPending: boolean;
  startTrans: typeof startTransition;
  addTime: ReturnType<typeof useMutation<typeof api.timeEntries.add>>;
  deleteTask: ReturnType<typeof useMutation<typeof api.tasks.deleteTask>>;
  updateTask: ReturnType<typeof useMutation<typeof api.tasks.updateTask>>;
  createTask: ReturnType<typeof useMutation<typeof api.tasks.createTask>>;
  timeDurations: number[];
  setTimeDurations: React.Dispatch<React.SetStateAction<number[]>>;
}

const TrackContext = createContext<TrackContextValue | null>(null);

export function useTrack() {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error("useTrack must be used within TrackProvider");
  return ctx;
}

interface Props {
  initialTasks: TaskWithTime[];
  children: React.ReactNode;
}

export function TrackProvider({ initialTasks, children }: Props) {
  const addTime = useMutation(api.timeEntries.add);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const createTask = useMutation(api.tasks.createTask);

  const [timeDurations, setTimeDurations] = useTimeDurations();

  const [optimisticTasks, setOptimistic] = useOptimistic<
    TaskWithTime[],
    OptimisticAction
  >(initialTasks, (current: TaskWithTime[], action: OptimisticAction) => {
    switch (action.type) {
      case "addTime":
        return current.map((t) =>
          t._id === action.taskId
            ? { ...t, todayTime: (t.todayTime ?? 0) + action.duration }
            : t,
        );
      case "updateTask":
        return current.map((t) =>
          t._id === action.taskId
            ? { ...t, title: action.title, topic: action.topic }
            : t,
        );
      case "deleteTask":
        return current.filter((t) => t._id !== action.taskId);
      case "addTask":
        return [...current, action.task];
      default:
        return current;
    }
  });

  const [isPending, startTrans] = useTransition();

  return (
    <TrackContext.Provider
      value={{
        tasks: initialTasks,
        optimisticTasks,
        setOptimistic,
        isPending,
        startTrans,
        addTime,
        deleteTask,
        updateTask,
        createTask,
        timeDurations,
        setTimeDurations,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
}
