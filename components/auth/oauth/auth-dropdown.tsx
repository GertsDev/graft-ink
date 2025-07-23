"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SignInWithGoogle } from "./SignInWithGoogle";
import { api } from "@/convex/_generated/api";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";

export default function AuthDropdown() {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    void signOut();
    setOpen(false);
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log("Settings clicked - to be implemented");
    setOpen(false);
  };

  return (
    <div className="flex justify-center items-center">
      <AuthLoading>
        <Button disabled>
          <User size={32} className="rounded-full" />
        </Button>
      </AuthLoading>

      <Unauthenticated>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="gap-2 text-md">
              Sign In
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-4 rounded-xl shadow-lg mt-0"
            align="end"
          >
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-semibold text-sm">
                  Sign in to your account
                </h3>
              </div>
              <Separator className="my-2" />

              <SignInWithGoogle />

              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </Unauthenticated>

      <Authenticated>
        <AuthenticatedDropdown
          open={open}
          onOpenChange={setOpen}
          onSignOut={handleSignOut}
          onSettings={handleSettings}
        />
      </Authenticated>
    </div>
  );
}

function AuthenticatedDropdown({
  open,
  onOpenChange,
  onSignOut,
  onSettings,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
  onSettings: () => void;
}) {
  // Only query for user data when authenticated
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {currentUser?.image ? (
            <Image
              src={currentUser.image}
              width={25}
              height={25}
              alt={currentUser.name || "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 rounded-xl shadow-lg mt-0"
        align="end"
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-3">
            {currentUser?.image ? (
              <Image
                width={25}
                height={25}
                src={currentUser.image}
                alt={currentUser.name || "User"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-9"
              onClick={onSettings}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
