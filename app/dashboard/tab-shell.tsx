// app/dashboard/tab-shell.tsx
"use client";

import React, { lazy, Suspense } from "react";
import TrackClient from "./track/track-client";
import PlanClient from "./plan/plan-client";
import { useDashboardData } from "./dashboard-context";
import { Skeleton } from "../../components/ui/skeleton";

const AnalyzeClient = lazy(() => import("./analyze/analyze-client"));

export function TabShell({ activeTab }: { activeTab: string }) {
  const { preloadedTasks, preloadedTimeEntries } = useDashboardData();

  const renderContent = () => {
    switch (activeTab) {
      case "track":
        return preloadedTasks ? <TrackClient /> : null;
      case "plan":
        return <PlanClient />;
      case "analyze":
        return preloadedTimeEntries ? (
          <Suspense
            fallback={
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
                {/* Period selector card */}
                <div className="bg-card rounded-lg border p-6">
                  <Skeleton className="h-7 w-32" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Skeleton className="h-9 w-16 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>

                {/* Visualization card */}
                <div className="bg-card rounded-lg border p-6">
                  <Skeleton className="h-7 w-48" />
                  <div className="mt-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-8 w-full rounded-lg" />
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <AnalyzeClient />
          </Suspense>
        ) : null;
      default:
        return preloadedTasks ? <TrackClient /> : null;
    }
  };

  return <div className="flex w-full flex-1 flex-col">{renderContent()}</div>;
}
