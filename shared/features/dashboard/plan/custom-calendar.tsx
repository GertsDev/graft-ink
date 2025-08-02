"use client";

import React, { useMemo } from "react";
import { format, isToday } from "date-fns";

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CustomCalendar({ selectedDate, onDateSelect }: CustomCalendarProps) {
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
            onClick={() => day && onDateSelect(day)}
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
  );
}