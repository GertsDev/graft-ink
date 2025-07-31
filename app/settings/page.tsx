"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const userSettings = useQuery(api.users.getUserSettings);
  const updateSettings = useMutation(api.users.updateUserSettings);
  const [dayStartHour, setDayStartHour] = useState<number | undefined>();

  // Set initial value when data loads
  const effectiveDayStartHour = dayStartHour ?? userSettings?.dayStartHour ?? 0;

  const handleSave = async () => {
    try {
      await updateSettings({ dayStartHour: effectiveDayStartHour });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    }
  };

  const formatTime = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <Link
          href="/dashboard/track"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm transition-all duration-200 hover:gap-3"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize how your time tracking works for you.
        </p>
      </div>

      <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150">
        <CardHeader>
          <CardTitle>Day Start Time</CardTitle>
          <CardDescription>
            {` Set when your day begins for analytics and time tracking.
            This affects how "today's time" is calculated across the app.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Day starts at:</label>
            <Select
              value={effectiveDayStartHour.toString()}
              onValueChange={(value) => setDayStartHour(parseInt(value))}
            >
              <SelectTrigger className="w-full transition-all duration-200 hover:ring-2 hover:ring-ring/20">
                <SelectValue placeholder="Select time">
                  {formatTime(effectiveDayStartHour)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {formatTime(hour)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-muted-foreground text-sm animate-in fade-in-0 duration-500 delay-300">
            <p className="transition-colors duration-200">
              <strong>Current setting:</strong> Your day starts at{" "}
              <span className="font-mono transition-all duration-300">
                {formatTime(userSettings?.dayStartHour ?? 0)}
              </span>
            </p>
            <p className="mt-2 transition-colors duration-200">
              {`This means your "today" runs from `}
              <span className="font-mono">
                {formatTime(userSettings?.dayStartHour ?? 0)}
              </span>
              {` to `}
              <span className="font-mono">
                {formatTime(((userSettings?.dayStartHour ?? 0) + 23) % 24)}
              </span>
              {` the next day.`}
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={effectiveDayStartHour === userSettings?.dayStartHour}
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-50"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
