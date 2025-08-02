"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useDebounce } from "../../../shared/features/dashboard/_hooks/use-debounce";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../shared/components/ui/card";
import { DateSelector } from "../../../shared/features/dashboard/plan/date-selector";
import { PlanEditor } from "../../../shared/features/dashboard/plan/plan-editor";

export default function PlanPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [planContent, setPlanContent] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const upsertPlan = useMutation(api.plans.upsertPlan);
  const planQuery = useQuery(api.plans.getPlan, { date: dateString });

  // Update plan content when query result changes
  useEffect(() => {
    if (planQuery !== undefined) {
      setPlanContent(planQuery ?? "");
    }
  }, [planQuery]);

  // Debounce DB writes
  const debouncedSave = useDebounce((content: string, date: string) => {
    upsertPlan({ date, planContent: content });
  }, 1200);

  // Handle textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setPlanContent(newContent);
    debouncedSave(newContent, dateString);
  };


  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4">
      {/* Plan Content */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-light">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              isCalendarOpen={isCalendarOpen}
              onCalendarOpenChange={setIsCalendarOpen}
            />
          </div>
        </CardHeader>
        <CardContent>
          <PlanEditor
            planContent={planContent}
            selectedDate={selectedDate}
            onChange={handleChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
