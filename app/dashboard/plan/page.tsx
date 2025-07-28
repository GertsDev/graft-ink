import { format } from "date-fns";
import PlanClient from "./plan-client";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export default async function PlanPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const preloadedPlan = await preloadQuery(api.plans.getPlan, { date: today });

  return <PlanClient preloadedPlan={preloadedPlan} />;
}
