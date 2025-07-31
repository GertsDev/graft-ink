"use client";

import React, { useRef, useState, useEffect } from "react";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { Calendar } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useDebounce } from "../../hooks/use-debounce";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

type DateOption = "today" | "yesterday" | "custom";

export default function PlanPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateOption, setDateOption] = useState<DateOption>("today");
  const [planContent, setPlanContent] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Handle date option changes
  const handleDateOptionChange = (option: DateOption) => {
    setDateOption(option);
    const today = new Date();

    switch (option) {
      case "today":
        setSelectedDate(today);
        break;
      case "yesterday":
        setSelectedDate(subDays(today, 1));
        break;
      case "custom":
        // Keep current selected date
        break;
    }
  };

  // Handle custom date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDateOption("custom");
    setIsCalendarOpen(false);
  };

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Get first day of month and how many days in month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Daily Plan</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            {/* Today/Yesterday Buttons */}
            <Button
              variant={dateOption === "today" ? "default" : "outline"}
              onClick={() => handleDateOptionChange("today")}
              size="sm"
            >
              Today
            </Button>

            <Button
              variant={dateOption === "yesterday" ? "default" : "outline"}
              onClick={() => handleDateOptionChange("yesterday")}
              size="sm"
            >
              Yesterday
            </Button>

            {/* Calendar Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={dateOption === "custom" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  {dateOption === "custom"
                    ? formatDisplayDate(selectedDate)
                    : "Pick Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <div className="mb-3 text-center font-semibold">
                    {format(today, "MMMM yyyy")}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-xs font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar days */}
                    {calendarDays.map((day, index) => (
                      <div key={index} className="p-1">
                        {day ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 text-xs ${
                              format(day, "yyyy-MM-dd") ===
                              format(selectedDate, "yyyy-MM-dd")
                                ? "bg-primary text-primary-foreground"
                                : isToday(day)
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                            }`}
                            onClick={() => handleDateSelect(day)}
                          >
                            {day.getDate()}
                          </Button>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Selected Date Display */}
            <div className="ml-auto text-sm text-gray-600">
              Plan for:{" "}
              <span className="font-medium">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Content */}
      <Card className="flex-1">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {formatDisplayDate(selectedDate)} Plan
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <textarea
            ref={textareaRef}
            className="focus:border-primary min-h-[500px] w-full resize-none rounded-md border-2 border-gray-300 p-4 text-sm leading-relaxed focus:outline-none"
            id="plan"
            value={planContent}
            onChange={handleChange}
            placeholder={`Write your plan for ${formatDisplayDate(selectedDate).toLowerCase()}...`}
            autoFocus
          />
        </CardContent>
      </Card>
    </div>
  );
}
