"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../shared/components/ui/card";
import {
  useAnalyzeData,
  type TimePeriod,
} from "../../../shared/features/dashboard/_hooks/use-analyze-data";
import {
  formatTime,
  formatDate,
  PERIOD_LABELS,
} from "../../../shared/features/dashboard/_utils/format-utils";
import { DayBarChart } from "../../../shared/features/dashboard/analyze/day-bar-chart";
import { AnalyzeControls } from "../../../shared/features/dashboard/analyze/analyze-controls";
import { LoadingState } from "../../../shared/features/dashboard/analyze/loading-state";
import { MonthAnalytics } from "../../../shared/features/dashboard/analyze/month-analytics";
import { WeekNavigation } from "../../../shared/features/dashboard/analyze/week-navigation";

export default function AnalyzePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const userSettings = useQuery(api.users.getUserSettings);
  const { filteredData, maxTime, isLoading, dayStartHour } =
    useAnalyzeData(selectedPeriod);

  // Helper function for date formatting with user settings
  const formatDateWithSettings = (dateString: string) => {
    return formatDate(dateString, selectedPeriod, dayStartHour);
  };

  if (isLoading || !userSettings) {
    return <LoadingState />;
  }

  // Render month analytics separately
  if (selectedPeriod === "month") {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-light">Analytics</h1>
          <AnalyzeControls
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
        <MonthAnalytics dayStartHour={userSettings.dayStartHour} />
      </div>
    );
  }

  // Enhanced week view with navigation
  if (selectedPeriod === "week") {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-light">Analytics</h1>
          <AnalyzeControls
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
        <WeekNavigation dayStartHour={userSettings.dayStartHour} />
      </div>
    );
  }

  // Original day/today/yesterday view
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      {/* Time Visualization */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-light">
              Time Spent by Topic - {PERIOD_LABELS[selectedPeriod]}
            </h3>
            <AnalyzeControls
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No time entries found for this period. Start tracking your time to
              see analytics here.
            </div>
          ) : (
            <DayBarChart
              data={filteredData}
              formatTime={formatTime}
              formatDate={formatDateWithSettings}
              maxTime={maxTime}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
