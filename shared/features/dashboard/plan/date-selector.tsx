"use client";

import React, { useMemo } from "react";
import { format, subDays, addDays } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { CustomCalendar } from "./custom-calendar";

type DateOption = "today" | "yesterday" | "custom";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isCalendarOpen: boolean;
  onCalendarOpenChange: (open: boolean) => void;
}

export function DateSelector({
  selectedDate,
  onDateChange,
  isCalendarOpen,
  onCalendarOpenChange,
}: DateSelectorProps) {
  const handleDateOptionChange = (option: DateOption) => {
    const today = new Date();

    switch (option) {
      case "today":
        onDateChange(today);
        break;
      case "yesterday":
        onDateChange(subDays(today, 1));
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

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    onCalendarOpenChange(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isDateOptionActive("yesterday") ? "default" : "outline"}
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
        onClick={() => onDateChange(addDays(selectedDate, 1))}
        className="h-8 px-3 text-xs"
      >
        Tomorrow
      </Button>
      <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <CustomCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}