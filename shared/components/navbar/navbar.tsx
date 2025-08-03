"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import AuthDropdown from "../auth/oauth/auth-dropdown";
import { usePathname } from "next/navigation";
import { Authenticated } from "convex/react";
import { Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

export const MobileDropdownMenu = () => {
  const pathname = usePathname();

  if (!pathname.startsWith("/dashboard")) return null;

  const getCurrentPageName = () => {
    if (pathname === "/dashboard/track") return "Track";
    if (pathname === "/dashboard/plan") return "Plan";
    if (pathname === "/dashboard/analyze") return "Analyze";
    return "Dashboard";
  };

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <Menu className="h-4 w-4" />
          {getCurrentPageName()}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/track" className="w-full cursor-pointer">
              Track
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/plan" className="w-full cursor-pointer">
              Plan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/analyze" className="w-full cursor-pointer">
              Analyze
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
        <MobileDropdownMenu />
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
        {/* marketing link removed as home is marketing */}
        <ThemeToggle />

        <AuthDropdown />
      </div>
    </header>
  );
};

export default NavBar;
