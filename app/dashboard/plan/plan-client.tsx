//app/dashboard/plan/plan-client.tsx
"use client";

import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useDebounce } from "../../hooks/use-debounce";
import { PreloadedQuery } from "../types";

const PlanClient = ({ preloadedPlan }: { preloadedPlan: PreloadedQuery }) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const fetchedPlan = usePreloadedQuery(preloadedPlan) ?? "";
  const [planContent, setPlanContent] = useState(fetchedPlan);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const upsertPlan = useMutation(api.plans.upsertPlan);

  // Debounce DB writes; useCallback ensures latest date/upsertPlan in closure
  const debouncedSave = useDebounce((content: string) => {
    upsertPlan({ date: today, planContent: content });
  }, 1200);

  // Handle textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setPlanContent(newContent);
    debouncedSave(newContent); // Auto-save (debounced)
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      {/* Date Picker */}
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        className="h-full w-full flex-1 rounded-md border-2 border-gray-300 p-2"
        id="plan"
        value={planContent}
        onChange={handleChange}
        placeholder="Draft your plan here..."
        autoFocus
      />
    </div>
  );
};

export default PlanClient;
