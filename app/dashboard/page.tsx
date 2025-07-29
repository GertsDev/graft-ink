//app/dashboard/page.tsx
import React, { Suspense } from "react";
import TrackPage from "./track/page";
import PlanPage from "./plan/page";
import AnalyzePage from "./analyze/page";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ tab }] = await Promise.all([searchParams]);
  const activeTab = tab ?? "track";

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const today = format(now, "yyyy-MM-dd");

  const [preloadedTasks, preloadedPlan, preloadedTimeEntries] =
    await Promise.all([
      preloadQuery(api.tasks.getUserTaskWithTime),
      preloadQuery(api.plans.getPlan, { date: today }),
      preloadQuery(api.timeEntries.getByRange, {
        start: weekAgo.getTime(),
        end: now.getTime(),
      }),
    ]);

  let content: React.ReactNode;
  switch (activeTab) {
    case "plan":
      content = <PlanPage preloadedPlan={preloadedPlan} />;
      break;
    case "analyze":
      content = <AnalyzePage preloadedTimeEntries={preloadedTimeEntries} />;
      break;
    default:
      content = <TrackPage preloadedTasks={preloadedTasks} />;
  }

  return <Suspense fallback={<div>Loading...</div>}>{content}</Suspense>;
}
