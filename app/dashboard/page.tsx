import React from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { TabShell } from "./tab-shell";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
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

  return (
    <TabShell
      activeTab={activeTab}
      preloadedTasks={preloadedTasks}
      preloadedPlan={preloadedPlan}
      preloadedTimeEntries={preloadedTimeEntries}
    />
  );
}
