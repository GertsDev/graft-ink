"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import { type TimePeriod } from "./_types/analytics-types";
import { PERIOD_LABELS } from "../_utils/format-utils";

interface AnalyzeControlsProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export function AnalyzeControls({ selectedPeriod, onPeriodChange }: AnalyzeControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {Object.entries(PERIOD_LABELS).map(([period, label]) => (
        <Button
          key={period}
          variant={selectedPeriod === period ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period as TimePeriod)}
          className="h-8 px-3 text-xs"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}