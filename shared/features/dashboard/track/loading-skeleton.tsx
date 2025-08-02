"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      {/* Daily Summary Skeleton */}
      <Card>
        <CardHeader className="pb-2">
          <div className="bg-muted h-8 w-32 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-2 w-full animate-pulse rounded" />
        </CardContent>
      </Card>

      {/* Add Task Button Skeleton */}
      <div className="flex justify-end">
        <div className="bg-muted h-10 w-24 animate-pulse rounded" />
      </div>

      {/* Tasks Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-muted h-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-32 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}