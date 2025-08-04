"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
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
import { StoryChart } from "../../../shared/components/visual-stories/story-chart";
import { EmptyStateStory } from "../../../shared/components/visual-stories/empty-state-story";
import { AnalyzeControls } from "../../../shared/features/dashboard/analyze/analyze-controls";
import { LoadingState } from "../../../shared/features/dashboard/analyze/loading-state";

export default function StoryAnalyzePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const { filteredData, maxTime, isLoading, dayStartHour } =
    useAnalyzeData(selectedPeriod);

  // Helper function for date formatting with user settings
  const formatDateWithSettings = (dateString: string) => {
    return formatDate(dateString, selectedPeriod, dayStartHour);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <motion.div
      className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced time visualization with storytelling */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="border-2 border-analyze-1/10 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-light mb-1">
                  Your Productivity Story - {PERIOD_LABELS[selectedPeriod]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Discover patterns, celebrate progress, and unlock insights from your focused work
                </p>
              </div>
              <AnalyzeControls
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <EmptyStateStory
                type="timeEntries"
                actionLabel="Start Tracking Time"
              />
            ) : (
              <StoryChart
                data={filteredData}
                formatTime={formatTime}
                formatDate={formatDateWithSettings}
                maxTime={maxTime}
                type={selectedPeriod === "week" ? "week" : "day"}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}