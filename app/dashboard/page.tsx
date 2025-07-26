//app/dashboard/page.tsx
import React from "react";
import { TabShell } from "./tab-shell";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab ?? "track";

  return (

    <TabShell activeTab={activeTab} />
  );
}
