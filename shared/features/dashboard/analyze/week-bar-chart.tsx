"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../../../components/ui/chart";
import { type DayData } from "../_hooks/use-analyze-data";

interface WeekBarChartProps {
  data: DayData[];
  formatTime: (minutes: number) => string;
  formatDate: (dateString: string) => string;
}

export function WeekBarChart({ data, formatTime, formatDate }: WeekBarChartProps) {
  // Get all unique topics for stacking
  const allTopics = Array.from(
    new Set(data.flatMap((day) => day.topics.map((topic) => topic.topic))),
  );

  // If no topics, show total bars with single color
  const hasTopics = allTopics.length > 0;

  // Transform data for recharts
  const chartData = data.map((day) => {
    const chartEntry: Record<string, string | number> = {
      day: formatDate(day.date),
      dayFull: day.date,
      total: day.total,
    };

    if (hasTopics) {
      // Add each topic as a separate data key
      day.topics.forEach((topic) => {
        chartEntry[topic.topic] = topic.time;
      });
    }

    return chartEntry;
  });

  // Create chart config with analyze theme colors
  const chartConfig: ChartConfig = {};

  if (hasTopics) {
    allTopics.forEach((topic, index) => {
      const analyzeColorIndex = (index % 5) + 1;
      chartConfig[topic] = {
        label: topic,
        color: `var(--analyze-${analyzeColorIndex})`,
      };
    });
  } else {
    chartConfig["total"] = {
      label: "Total Time",
      color: "var(--analyze-1)",
    };
  }

  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 50,
            bottom: 30,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value === 0) return "";
              const h = Math.floor(value / 60);
              const m = value % 60;
              if (h && m) return `${h}h ${m}m`;
              if (h) return `${h}h`;
              if (m) return `${m}m`;
              return "";
            }}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            width={50}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              const data = payload[0]?.payload;
              if (!data) return null;

              return (
                <div className="bg-background rounded-lg border p-3 shadow-md">
                  <p className="mb-2 font-medium">{label}</p>
                  <div className="space-y-1">
                    {allTopics.map((topic) => {
                      const value = data[topic];
                      if (!value) return null;
                      return (
                        <div
                          key={topic}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: chartConfig[topic]?.color,
                            }}
                          />
                          <span>
                            {topic}: {formatTime(value)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="mt-2 border-t pt-1">
                      <span className="text-sm font-medium">
                        Total: {formatTime(data.total)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          {hasTopics ? (
            allTopics.map((topic, index) => {
              const analyzeColorIndex = (index % 5) + 1;
              return (
                <Bar
                  key={topic}
                  dataKey={topic}
                  stackId="topics"
                  fill={`var(--analyze-${analyzeColorIndex})`}
                  radius={0}
                />
              );
            })
          ) : (
            <Bar dataKey="total" fill="var(--analyze-1)" radius={0} />
          )}
        </BarChart>
      </ChartContainer>
    </div>
  );
}