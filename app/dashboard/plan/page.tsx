"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isToday, isYesterday, subDays, addDays } from "date-fns";
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

  // Handle date option changes
  const handleDateOptionChange = (option: DateOption) => {
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

  const { todayString, yesterdayString, tomorrowString, selectedString } =
    useMemo(() => {
      const today = new Date();
      return {
        todayString: format(today, "yyyy-MM-dd"),
        yesterdayString: format(subDays(today, 1), "yyyy-MM-dd"),
        tomorrowString: format(addDays(today, 1), "yyyy-MM-dd"),
        selectedString: format(selectedDate, "yyyy-MM-dd"),
      };
    }, [selectedDate]);

  const isDateOptionActive = (option: DateOption) => {
    switch (option) {
      case "today":
        return selectedString === todayString;
      case "yesterday":
        return selectedString === yesterdayString;
      default:
        return false;
    }
  };

  const isTomorrowActive = () => selectedString === tomorrowString;

  // Handle custom date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const { calendarDays, today } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return { calendarDays: days, today };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4">
      {/* Plan Content */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-light">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant={
                  isDateOptionActive("yesterday") ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleDateOptionChange("yesterday")}
                className="h-8 px-3 text-xs"
              >
                Yesterday
              </Button>
              <Button
                variant={isDateOptionActive("today") ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateOptionChange("today")}
                className="h-8 px-3 text-xs"
              >
                Today
              </Button>
              <Button
                variant={isTomorrowActive() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="h-8 px-3 text-xs"
              >
                Tomorrow
              </Button>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        {format(today, "MMMM yyyy")}
                      </h4>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div
                          key={day}
                          className="p-1 font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      ))}
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => day && handleDateSelect(day)}
                          disabled={!day}
                          className={`hover:bg-primary/40 rounded p-1 text-xs ${
                            day &&
                            format(day, "yyyy-MM-dd") ===
                              format(selectedDate, "yyyy-MM-dd")
                              ? "bg-muted/60 text-white hover:bg-blue-600"
                              : day && isToday(day)
                                ? "bg-primary/60 text-primary-foreground hover:bg-blue-600"
                                : ""
                          }`}
                        >
                          {day ? day.getDate() : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            className="focus:border-primary min-h-[500px] w-full resize-none rounded-md border-2 border-gray-300 p-4 font-mono text-sm leading-relaxed focus:outline-none"
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
