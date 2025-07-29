import PlanClient from "./plan-client";

interface Props {
  preloadedPlan: Awaited<
    ReturnType<typeof import("convex/nextjs").preloadQuery>
  >;
}

export default function PlanPage({ preloadedPlan }: Props) {
  return <PlanClient preloadedPlan={preloadedPlan} />;
}
