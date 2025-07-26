"use client";

import React from "react";

import { Edit3, Pin } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../_components/ui/card";
import { Button } from "../../../_components/ui/button";
import { Badge } from "../../../_components/ui/badge";

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

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} ${mins}`;
};

export default function Track() {
  // const tasks = useQuery(api.tasks.getUserTaskWithTime) || [];
  // const addTime = useMutation(api.timeEntries.add);
  // const create = useMutation(api.tasks.createTask);

  // const totalToday = tasks.reduce((sum, t) => sum + (t.todayTime || 0), 0);

  // const handleAddTime = async (taskId: Id<"tasks">, duration: number) => {
  //   addTime({ taskId, duration });
  // };

  return (
    <div className="mx-auto flex min-h-96 min-w-100 flex-col gap-4">
      {/* Summary Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <h2 className="text-2xl font-bold">2h 15m TODAY</h2>
          <div className="text-muted-foreground text-right text-sm">
            <p>Hackathon Prepare: 45min</p>
            <p>React Learning: 1h 30min</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary flex h-2 w-full overflow-hidden rounded-full">
            <div className="h-full bg-orange-500" style={{ width: "33.33%" }} />
            <div className="h-full bg-orange-400" style={{ width: "66.67%" }} />
          </div>
        </CardContent>
      </Card>

      <Button className="bg-primary mt-2">Add card</Button>

      {/* Task Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tasks.map((task) => (
          <Card key={task.title} className="relative">
            <CardHeader className="pb-2">
              <div className="asbsolute top-3 right-3 flex gap-2">
                <Edit3 className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                <Pin className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
              </div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-muted-foreground text-sm">{task.time}</p>
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
