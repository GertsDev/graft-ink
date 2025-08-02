"use client";

import React from "react";
import { type DayData } from "../_hooks/use-analyze-data";
import { getTopicColor } from "../_hooks/use-analyze-data";

interface DayBarChartProps {
  data: DayData[];
  formatTime: (minutes: number) => string;
  formatDate: (dateString: string) => string;
  maxTime: number;
}

export function DayBarChart({ data, formatTime, formatDate, maxTime }: DayBarChartProps) {
  return (
    <div className="space-y-4">
      {data.map((day) => (
        <div key={day.date} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              {formatDate(day.date)}
            </span>
            <span className="text-sm font-semibold">
              {formatTime(day.total)}
            </span>
          </div>

          {/* Topic Bar */}
          <div className="bg-muted h-12 w-full overflow-hidden rounded-lg">
            <div className="flex h-full">
              {day.total > 0 ? (
                day.topics.length > 0 ? (
                  day.topics.map((topic, index) => (
                    <div
                      key={`${topic.topic}-${index}`}
                      className={`group relative flex items-center justify-center ${topic.color}`}
                      style={{
                        width: `${(topic.time / maxTime) * 100}%`,
                        minWidth: topic.time > 0 ? "2px" : "0px",
                      }}
                      title={`${topic.topic}: ${formatTime(topic.time)}`}
                    >
                      {/* Tooltip */}
                      <div className="bg-foreground text-background absolute left-1/2 z-10 mb-2 hidden -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap group-hover:block">
                        {topic.topic}: {formatTime(topic.time)}
                      </div>
                    </div>
                  ))
                ) : (
                  // Show a single bar for uncategorized time
                  <div
                    className={`group relative flex h-full w-full items-center justify-center ${getTopicColor("Uncategorized")}`}
                    title={`Uncategorized: ${formatTime(day.total)}`}
                  >
                    <div className="bg-foreground text-background absolute left-1/2 z-10 mb-2 hidden -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap group-hover:block">
                      Uncategorized: {formatTime(day.total)}
                    </div>
                  </div>
                )
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                  No activity
                </div>
              )}
            </div>
          </div>

          {/* Topic Legend */}
          {day.total > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {day.topics.length > 0 ? (
                day.topics.map((topic, index) => (
                  <div
                    key={`legend-${topic.topic}-${index}`}
                    className="flex items-center gap-1"
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${topic.color}`}
                    />
                    <span className="text-muted-foreground text-xs">
                      {topic.topic} ({formatTime(topic.time)})
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-1">
                  <div
                    className={`h-3 w-3 rounded-full ${getTopicColor("Uncategorized")}`}
                  />
                  <span className="text-muted-foreground text-xs">
                    Uncategorized ({formatTime(day.total)})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}