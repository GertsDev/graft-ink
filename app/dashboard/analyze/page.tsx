"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../../../shared/components/ui/chart";
import {
  useAnalyzeData,
  getTopicColor,
  type TimePeriod,
  type DayData,
} from "../../../shared/features/dashboard/_hooks/use-analyze-data";
import {
  formatTime,
  formatDate,
  PERIOD_LABELS,
} from "../../../shared/features/dashboard/_utils/format-utils";

interface WeekBarChartProps {
  data: DayData[];
  formatTime: (minutes: number) => string;
  formatDate: (dateString: string) => string;
}

function WeekBarChart({ data, formatTime, formatDate }: WeekBarChartProps) {
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

export default function AnalyzePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const { filteredData, maxTime, isLoading, dayStartHour } = useAnalyzeData(selectedPeriod);

  // Helper function for date formatting with user settings
  const formatDateWithSettings = (dateString: string) => {
    return formatDate(dateString, selectedPeriod, dayStartHour);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
        <Card>
          <CardContent className="py-8">
            <div className="text-muted-foreground text-center">
              Loading analytics data...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      {/* Time Visualization */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-light">
              Time Spent by Topic - {PERIOD_LABELS[selectedPeriod]}
            </h3>
            <div className="flex items-center gap-2">
              {Object.entries(PERIOD_LABELS).map(([period, label]) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period as TimePeriod)}
                  className="h-8 px-3 text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No time entries found for this period. Start tracking your time to
              see analytics here.
            </div>
          ) : selectedPeriod === "week" ? (
            <WeekBarChart
              data={filteredData}
              formatTime={formatTime}
              formatDate={formatDateWithSettings}
            />
          ) : (
            <div className="space-y-4">
              {filteredData.map((day) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">
                      {formatDateWithSettings(day.date)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
