"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt/Option key + number (works on both Mac and Windows)
      if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
        switch (e.code) {
          case "Digit1":
            e.preventDefault();
            router.push("/dashboard/track");
            break;
          case "Digit2":
            e.preventDefault();
            router.push("/dashboard/plan");
            break;
          case "Digit3":
            e.preventDefault();
            router.push("/dashboard/analyze");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [router]);

  return (
    <div className="min-h-full w-full py-5">
      <div className="mx-auto w-full max-w-5xl px-4">{children}</div>
    </div>
  );
}
