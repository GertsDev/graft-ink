// app/dashboard/track/page.tsx

// React Server Component – runs on the server, sends HTML with data inside
import TrackClient from "./track-client";

interface Props {
  preloadedTasks: Awaited<
    ReturnType<typeof import("convex/nextjs").preloadQuery>
  >;
}

export default function TrackPage({ preloadedTasks }: Props) {
  return <TrackClient preloadedTasks={preloadedTasks} />;
}
