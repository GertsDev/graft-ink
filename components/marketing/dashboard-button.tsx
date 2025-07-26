"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardButton() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <Button onClick={handleGoToDashboard} size="lg" className="px-8 py-3">
      Go to Dashboard
    </Button>
  );
}
