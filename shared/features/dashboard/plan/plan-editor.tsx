"use client";

import React from "react";
import { format, isToday, isYesterday } from "date-fns";

interface PlanEditorProps {
  planContent: string;
  selectedDate: Date;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PlanEditor({ planContent, selectedDate, onChange }: PlanEditorProps) {
  // Format date for display
  const formatDisplayDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  return (
    <textarea
      className="focus:border-primary text-md sm:text-md min-h-[500px] w-full resize-none rounded-md border-2 border-gray-300 p-4 text-base leading-relaxed font-light focus:outline-none"
      id="plan"
      value={planContent}
      onChange={onChange}
      placeholder={`Write your plan for ${formatDisplayDate(selectedDate).toLowerCase()}...`}
      autoFocus
    />
  );
}