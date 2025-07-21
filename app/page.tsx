"use client";

import Navbar from "../components/navbar/NavBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8 ">
        <h1 className="text-4xl font-bold text-center">
          Convex + Next.js + Clerk
        </h1>
      </main>
    </>
  );
}
