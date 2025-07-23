"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import Navbar from "../components/NavBar/NavBar";
import MarketingPage from "../components/Marketing/MarketingPage";
import DashboardPage from "../components/Dashboard/DashboardPage";

export default function Home() {
  return (
    <>
      <main className="h-screen w-full flex flex-col">
        <Navbar />
        <Unauthenticated>
          <MarketingPage />
        </Unauthenticated>
        <Authenticated>
          <DashboardPage />
        </Authenticated>
      </main>
    </>
  );
}
