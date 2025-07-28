import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import AnalyzeClient from "./analyze-client";

export default async function AnalyzePage() {
  // Get data for the last 7 days for analysis
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const preloadedTimeEntries = await preloadQuery(api.timeEntries.getByRange, {
    start: weekAgo.getTime(),
    end: now.getTime(),
  });

  return <AnalyzeClient preloadedTimeEntries={preloadedTimeEntries} />;
}
