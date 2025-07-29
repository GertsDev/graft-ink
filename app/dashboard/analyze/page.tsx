import AnalyzeClient from "./analyze-client";

interface Props {
  preloadedTimeEntries: Awaited<
    ReturnType<typeof import("convex/nextjs").preloadQuery>
  >;
}

export default function AnalyzePage({ preloadedTimeEntries }: Props) {
  return <AnalyzeClient preloadedTimeEntries={preloadedTimeEntries} />;
}
