// app/page.tsx
import MarketingPage from "../shared/components/marketing/marketing-page";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col">
      <MarketingPage />
    </main>
  );
}
