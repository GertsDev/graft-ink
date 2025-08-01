"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import AuthDropdown from "../auth/oauth/auth-dropdown";
import { usePathname } from "next/navigation";
import { Authenticated } from "convex/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// Detect if user is on Mac or Windows for keyboard shortcuts
const getShortcutKey = () => {
  if (typeof window !== "undefined") {
    return navigator.userAgent.toLowerCase().includes("mac") ? "⌥" : "Alt";
  }
  return "Alt";
};

const DesktopDashboardTabs = () => {
  const pathname = usePathname();
  const shortcutKey = getShortcutKey();

  if (!pathname.startsWith("/dashboard")) return null;

  const tabClass = (path: string) =>
    `cursor-pointer px-4 py-2 text-lg font-medium ${
      pathname === path ? "border-b-2 border-orange-500" : "opacity-70"
    }`;

  return (
    <TooltipProvider>
      <nav className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/track"
              className={tabClass("/dashboard/track")}
            >
              Track
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{shortcutKey} + 1</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/plan"
              className={tabClass("/dashboard/plan")}
            >
              Plan
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{shortcutKey} + 2</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/analyze"
              className={tabClass("/dashboard/analyze")}
            >
              Analyze
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{shortcutKey} + 3</p>
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
};

export const MobileBottomTabs = () => {
  const pathname = usePathname();

  if (!pathname.startsWith("/dashboard")) return null;

  const tabClass = (path: string) =>
    `flex-1 text-center py-2 text-base font-medium ${
      pathname === path ? "text-primary" : "opacity-70"
    }`;

  return (
    <nav className="bg-background sticky bottom-0 z-50 flex justify-around border-t px-4 py-2 pb-7 md:hidden">
      <Link href="/dashboard/track" className={tabClass("/dashboard/track")}>
        Track
      </Link>
      <Link href="/dashboard/plan" className={tabClass("/dashboard/plan")}>
        Plan
      </Link>
      <Link
        href="/dashboard/analyze"
        className={tabClass("/dashboard/analyze")}
      >
        Analyze
      </Link>
    </nav>
  );
};

const NavBar = () => {
  const pathname = usePathname();

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
        <Authenticated>
          {(pathname === "/" || pathname === "/home") && (
            <Link
              href="/dashboard/track"
              className="hover:text-primary text-sm font-semibold"
            >
              Dashboard
            </Link>
          )}
        </Authenticated>
        <ThemeToggle />

        <AuthDropdown />
      </div>
    </header>
  );
};

export default NavBar;
