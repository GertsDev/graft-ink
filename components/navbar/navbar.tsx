"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import AuthDropdown from "../auth/oauth/auth-dropdown";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const DesktopDashboardTabs = () => {
  const pathname = usePathname();
  console.log("🚀 ~ DesktopDashboardTabs ~ pathname:", pathname)
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!pathname.startsWith("/dashboard")) return null;

  const currentTab = searchParams.get("tab") ?? "track";

  const handleClick = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", value);
    router.replace(`/dashboard?${next.toString()}`, { scroll: false });
  };

  const tabClass = (val: string) =>
    `cursor-pointer px-4 py-2 text-lg font-medium ${
      currentTab === val ? "border-b-2 border-orange-500" : "opacity-70"
    }`;

  return (
    <nav className="flex gap-4  ">
      <span
        className={tabClass("track")}
        onClick={() => handleClick("track")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick("track")}
      >
        Track
      </span>
      <span
        className={tabClass("plan")}
        onClick={() => handleClick("plan")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick("plan")}
      >
        Plan
      </span>
      <span
        className={tabClass("analyze")}
        onClick={() => handleClick("analyze")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick("analyze")}
      >
        Analyze
      </span>
    </nav>
  );
};

export const MobileBottomTabs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!pathname.startsWith("/dashboard")) return null;

  const currentTab = searchParams.get("tab") ?? "track";

  const handleClick = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", value);
    router.replace(`/dashboard?${next.toString()}`, { scroll: false });
  };

  const tabClass = (val: string) =>
    `flex-1 text-center py-2 text-base font-medium ${
      currentTab === val ? "text-primary" : "opacity-70"
    }`;

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 flex justify-around border-t md:hidden h-14">
      <button
        className={tabClass("track")}
        onClick={() => handleClick("track")}
      >
        Track
      </button>
      <button className={tabClass("plan")} onClick={() => handleClick("plan")}>
        Plan
      </button>
      <button
        className={tabClass("analyze")}
        onClick={() => handleClick("analyze")}
      >
        Analyze
      </button>
    </nav>
  );
};

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b-2 px-1 py-1 backdrop-blur-md md:px-8">
      <Link href="/">
        <div className="flex items-center gap-3 ps-4">
          {/* <Image
            className="dark:invert-0 invert"
            src="/logo.png"
            alt="Graft Logo"
            width={40}
            height={40}
          /> */}
          <span className="text-2xl font-bold tracking-wide">GRAFT</span>
        </div>
      </Link>
      <div className="hidden flex-1 justify-center md:flex">
        <DesktopDashboardTabs />
      </div>

      <div className="flex items-center gap-4 pr-4">
        <ThemeToggle />
        <AuthDropdown />
      </div>
    </header>
  );
};

export default NavBar;
