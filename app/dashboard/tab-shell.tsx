// app/dashboard/tab-shell.tsx
"use client";

import TrackClient from "./track/track-client";
import PlanClient from "./plan/plan-client";
import AnalyzeClient from "./analyze/analyze-client";
import { useDashboardData } from "./dashboard-context";

export function TabShell({ activeTab }: { activeTab: string }) {
  const { preloadedTasks, preloadedTimeEntries } = useDashboardData();

  const renderContent = () => {
    switch (activeTab) {
      case "track":
        return preloadedTasks ? <TrackClient /> : null;
      case "plan":
        return <PlanClient />;
      case "analyze":
        return preloadedTimeEntries ? <AnalyzeClient /> : null;
      default:
        return preloadedTasks ? <TrackClient /> : null;
    }
  };

  return <div className="flex w-full flex-1 flex-col">{renderContent()}</div>;
}
