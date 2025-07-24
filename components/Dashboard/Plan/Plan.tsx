import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import debounce from "lodash.debounce";

const Plan = () => {
  // eslint-disable-next-line
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planContent, setPlanContent] = useState("");

  // Format date as 'YYYY-MM-DD'
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Query: Fetch plan for selected date (auto-subscibes for real-time updates)
  const fetchedPlan = useQuery(api.plans.getPlan, { date: formattedDate });

  // Mutation: For saving
  const upsertPlan = useMutation(api.plans.upsertPlan);

  useEffect(() => {
    setPlanContent(fetchedPlan ?? "");
  }, [fetchedPlan]);

  // Debounce DB writes; useCallback ensures latest date/upsertPlan in closure
  const debouncedSave = useCallback(
    debounce((content: string) => {
      upsertPlan({ date: formattedDate, planContent: content });
    }, 1500),
    [formattedDate, upsertPlan],
  );

  // Handle textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setPlanContent(newContent);
    debouncedSave(newContent); // Auto-save (debounced)
  };

  return (
    <div className="mx-auto flex min-h-96 min-w-100 flex-col gap-4">
      {/* Date Picker */}
      {/* Textarea */}
      <textarea
        className="h-full w-full flex-1 rounded-md border-2 border-gray-300 p-2"
        id="plan"
        value={planContent}
        onChange={handleChange}
        placeholder="Draft your plan here..."
      />
    </div>
  );
};

export default Plan;
