"use client";

import { usePreloadedQuery } from "convex/react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { useMemo } from "react";

interface TimeEntry {
  taskTitle: string;
  taskTopic?: string;
  duration: number;
  startedAt: number;
}

interface GroupedEntries {
  total: number;
  entries: TimeEntry[];
}

interface AnalyzeClientProps {
  preloadedTimeEntries: Awaited<
    ReturnType<typeof import("convex/nextjs").preloadQuery>
  >;
}

export default function AnalyzeClient({ preloadedTimeEntries }: AnalyzeClientProps) {
  const timeEntries = usePreloadedQuery(preloadedTimeEntries) as Record<string, GroupedEntries> ?? {};

  const analytics = useMemo(() => {
    const entries = Object.values(timeEntries).flatMap(item => item.entries);

    if (entries.length === 0) {
      return {
        totalTime: 0,
        averagePerDay: 0,
        topTasks: [],
        topTopics: [],
        dailyBreakdown: [],
        productivityScore: 0,
      };
    }

    const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const averagePerDay = Math.round(totalTime / 7);

    // Group by task title and calculate totals
    const taskTotals = entries.reduce((acc, entry) => {
      acc[entry.taskTitle] = (acc[entry.taskTitle] || 0) + entry.duration;
      return acc;
    }, {} as Record<string, number>);

    const topTasks = Object.entries(taskTotals)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([task, time]) => ({ task: task as string, time: time as number }));

    // Group by topic
    const topicTotals = entries.reduce((acc, entry) => {
      const topic = entry.taskTopic || "Uncategorized";
      acc[topic] = (acc[topic] || 0) + entry.duration;
      return acc;
    }, {} as Record<string, number>);

    const topTopics = Object.entries(topicTotals)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([topic, time]) => ({ topic: topic as string, time: time as number }));

    // Daily breakdown
    const dailyTotals = entries.reduce((acc, entry) => {
      const date = new Date(entry.startedAt).toDateString();
      acc[date] = (acc[date] || 0) + entry.duration;
      return acc;
    }, {} as Record<string, number>);

    const dailyBreakdown = Object.entries(dailyTotals)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, time]) => ({ date: date as string, time: time as number }));

    // Simple productivity score based on consistency
    const daysWorked = Object.keys(dailyTotals).length;
    const productivityScore = Math.round((daysWorked / 7) * 100);

    return {
      totalTime,
      averagePerDay,
      topTasks,
      topTopics,
      dailyBreakdown,
      productivityScore,
    };
  }, [timeEntries]);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (analytics.totalTime === 0) {
    return (
      <div className="mx-auto flex min-h-96 min-w-100 flex-col gap-4">
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No time entries found for the last 7 days. Start tracking your time to see analytics here.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-96 min-w-100 flex-col gap-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Time (7 days)</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatTime(analytics.totalTime)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Daily Average</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatTime(analytics.averagePerDay)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Consistency Score</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.productivityScore}%</p>
            <p className="text-xs text-gray-500 mt-1">
              Based on days worked this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Tasks */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Tasks</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topTasks.map(({ task, time }, index) => (
              <div key={task} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{task}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatTime(time)}</span>
                  <p className="text-xs text-gray-500">
                    {Math.round((time / analytics.totalTime) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Topics */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Time by Topic</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topTopics.map(({ topic, time }, index) => (
              <div key={topic} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 50%, 50%)`
                    }}
                  />
                  <span className="font-medium">{topic}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatTime(time)}</span>
                  <p className="text-xs text-gray-500">
                    {Math.round((time / analytics.totalTime) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Daily Breakdown</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.dailyBreakdown.map(({ date, time }) => (
              <div key={date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium">{formatDate(date)}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min(100, (time / Math.max(...analytics.dailyBreakdown.map(d => d.time))) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="font-semibold text-sm">{formatTime(time)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
