// app/dashboard/tab-shell.tsx
"use client";

import { DashboardPageProps } from "./types";
import TrackClient from "./track/track-client";
import PlanClient from "./plan/plan-client";
import AnalyzeClient from "./analyze/analyze-client";

export function TabShell({
  activeTab,
  preloadedTasks,
  preloadedPlan,
  preloadedTimeEntries,
}: DashboardPageProps & { activeTab: string }) {
  const renderContent = () => {
    switch (activeTab) {
      case "track":
        return preloadedTasks ? (
          <TrackClient preloadedTasks={preloadedTasks} />
        ) : null;
      case "plan":
        return preloadedPlan ? (
          <PlanClient preloadedPlan={preloadedPlan} />
        ) : null;
      case "analyze":
        return preloadedTimeEntries ? (
          <AnalyzeClient preloadedTimeEntries={preloadedTimeEntries} />
        ) : null;
      default:
        return preloadedTasks ? (
          <TrackClient preloadedTasks={preloadedTasks} />
        ) : null;
    }
  };

  return <div className="flex w-full flex-1 flex-col">{renderContent()}</div>;
}
