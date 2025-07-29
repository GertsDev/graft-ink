// app/dashboard/tab-shell.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
type PreloadedAny = Awaited<
  ReturnType<typeof import("convex/nextjs").preloadQuery>
>;
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the page components to avoid SSR issues
const PlanPage = dynamic(() => import("./plan/page"), {
  loading: () => <div>Loading...</div>,
});

const TrackPage = dynamic(() => import("./track/page"), {
  loading: () => <div>Loading...</div>,
});

const AnalyzePage = dynamic(() => import("./analyze/page"), {
  loading: () => <div>Loading...</div>,
});

// Accept preloaded Convex queries (currently unused; needed for type compatibility)
export function TabShell({
  activeTab,
  preloadedTasks,
  preloadedPlan,
  preloadedTimeEntries,
}: {
  activeTab: string;
  preloadedTasks?: PreloadedAny;
  preloadedPlan?: PreloadedAny;
  preloadedTimeEntries?: PreloadedAny;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      next.set("tab", value);
      router.replace(`/dashboard?${next.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="flex w-full flex-1 flex-col items-center"
    >
      <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="track"
          className="data-[state=active]:after:bg-primary relative rounded-none py-2 text-xl after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Track
        </TabsTrigger>
        <TabsTrigger
          value="plan"
          className="data-[state=active]:after:bg-primary relative rounded-none py-2 text-xl after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Plan
        </TabsTrigger>
        <TabsTrigger
          value="analyze"
          className="data-[state=active]:after:bg-primary relative rounded-none py-2 text-xl after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Analyze
        </TabsTrigger>
      </TabsList>

      <TabsContent value="track">
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <TrackPage preloadedTasks={preloadedTasks as any} />
          </Suspense>
        </div>
      </TabsContent>
      <TabsContent value="plan">
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PlanPage preloadedPlan={preloadedPlan as any} />
          </Suspense>
        </div>
      </TabsContent>
      <TabsContent value="analyze">
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <AnalyzePage preloadedTimeEntries={preloadedTimeEntries as any} />
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
