// app/dashboard/dashboard-context.tsx
"use client";

import React, { createContext, useContext } from "react";
import { PreloadedQuery } from "./track/types";

interface DashboardDataContextValue {
  preloadedTasks?: PreloadedQuery;
  preloadedTimeEntries?: PreloadedQuery;
}

const DashboardDataContext = createContext<
  DashboardDataContextValue | undefined
>(undefined);

export function DashboardDataProvider({
  children,
  preloadedTasks,
  preloadedTimeEntries,
}: React.PropsWithChildren<DashboardDataContextValue>) {
  return (
    <DashboardDataContext.Provider
      value={{ preloadedTasks, preloadedTimeEntries }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx)
    throw new Error(
      "useDashboardData must be used within <DashboardDataProvider>",
    );
  return ctx;
}
