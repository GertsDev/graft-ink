"use client";

import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

export function LoadingState() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      <Card>
        <CardContent className="py-8">
          <div className="text-muted-foreground text-center">
            Loading analytics data...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}