// app/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Pin } from "lucide-react";

const tasks = [
  {
    title: "Diving into classes",
    time: "0m TODAY",
    tags: ["Programming", "OOP", "Classes"],
  },
  {
    title: "CV",
    time: "0m TODAY",
    tags: ["Interview"],
  },
  {
    title: "Hackathon Prepare",
    time: "45m TODAY",
    tags: ["Hackathon"],
  },
  {
    title: "React learning",
    time: "1h 30m TODAY",
    tags: ["React"],
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="font-hand text-sm text-muted-foreground">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight">Graft</h1>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-5 rounded-full border border-muted-foreground" />
          <div className="h-5 w-5 rounded-full border border-muted-foreground" />
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="track" className="mt-6">
        <TabsList className="grid w-full max-w-xs grid-cols-3">
          <TabsTrigger value="track">Track</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <h2 className="text-2xl font-bold">2h 15m TODAY</h2>
          <div className="text-right text-sm text-muted-foreground">
            <p>Hackathon Prepare: 45min</p>
            <p>React Learning: 1h 30min</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-orange-500"
              style={{ width: "33.33%" }}
            />
            <div
              className="h-full bg-orange-400"
              style={{ width: "66.67%" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Task Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tasks.map((task) => (
          <Card key={task.title} className="relative">
            <CardHeader className="pb-2">
              <div className="absolute right-3 top-3 flex gap-2">
                <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                <Pin className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.time}</p>
            </CardHeader>
            <CardContent>
              <Button size="sm" variant="secondary" className="mb-3">
                Add 45m
              </Button>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
