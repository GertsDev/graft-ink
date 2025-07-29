export type PreloadedQuery = Awaited<
  ReturnType<typeof import("convex/nextjs").preloadQuery>
>;

export interface DashboardPageProps {
  preloadedTasks?: PreloadedQuery;
  preloadedPlan?: PreloadedQuery;
  preloadedTimeEntries?: PreloadedQuery;
}
