// app/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to track by default
  redirect("/dashboard/track");
}
