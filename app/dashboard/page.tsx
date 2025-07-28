//app/dashboard/page.tsx
import React, { Suspense } from "react";
import { TabShell } from "./tab-shell";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab ?? "track";

  return (
    <div className="">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <TabShell activeTab={activeTab} />
      </Suspense>
    </div>
  );
}
