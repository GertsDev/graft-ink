"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import AuthDropdown from "../auth/oauth/auth-dropdown";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-1 py-1 border-b-2  md:px-8 backdrop-blur-md ">
      <Link href="/">
        <div className="flex items-center gap-3 ps-4">
          {/* <Image
            className="dark:invert-0 invert"
            src="/logo.png"
            alt="Graft Logo"
            width={40}
            height={40}
          /> */}
          <span className="text-2xl font-bold tracking-wide  ">GRAFT</span>
        </div>
      </Link>
      <div className="flex items-center  gap-2">
        <ThemeToggle />
        <AuthDropdown />
      </div>
    </header>
  );
};

export default NavBar;
