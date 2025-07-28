// app/dashboard/track/page.tsx

// React Server Component – runs on the server, sends HTML with data inside
import { preloadQuery } from "convex/nextjs";
import TrackClient from "./track-client";
import { api } from "../../../convex/_generated/api";

export default async function TrackPage() {
  // 1️⃣  Server fetches the tasks (zero round-trip for the browser)
  const preloadedTasks = await preloadQuery(api.tasks.getUserTaskWithTime);

  // 2️⃣  Pass the *reference* to the client
  return <TrackClient preloadedTasks={preloadedTasks} />;
}
