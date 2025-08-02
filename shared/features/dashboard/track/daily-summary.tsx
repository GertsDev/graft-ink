"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";
import { formatTime } from "../_utils/time-utils";
import { type Doc } from "../../../../convex/_generated/dataModel";

interface DailySummaryProps {
  totalToday: number;
  tasks: Doc<"tasks">[];
}

export function DailySummary({ totalToday, tasks }: DailySummaryProps) {
  return (
    <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <h2 className="text-2xl font-bold transition-all duration-300">
          <span className="font-mono">{formatTime(totalToday)}</span> TODAY
        </h2>
        <div className="text-muted-foreground animate-in fade-in-0 text-right text-sm delay-100 duration-300">
          {tasks
            .filter((t) => (t.todayTime ?? 0) > 0)
            .slice(0, 2)
            .map((t) => (
              <p key={t._id} className="transition-all duration-200">
                {t.title}:{" "}
                <span className="font-mono">
                  {formatTime(t.todayTime ?? 0)}
                </span>
              </p>
            ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary flex h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, (totalToday / 180) * 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}