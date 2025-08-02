"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import { SignInWithGoogle } from "./sign-in-with-google";
import { api } from "@/convex/_generated/api";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "../../ui/skeleton";
import { useRouter } from "next/navigation";

export default function AuthDropdown() {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    // Redirect to home page after sign out
    router.push("/");
  };

  const handleSettings = () => {
    router.push("/settings");
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <AuthLoading>
        <Skeleton className="size-9 animate-pulse rounded-full" />
      </AuthLoading>

      <Unauthenticated>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-md gap-2">
              Sign In
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="mt-0 w-64 rounded-xl p-4 shadow-lg"
            align="end"
          >
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-sm font-semibold">
                  Sign in to your account
                </h3>
              </div>
              <Separator className="my-2" />

              <SignInWithGoogle />

              <p className="text-muted-foreground text-center text-xs">
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
        className="mt-0 w-56 rounded-xl p-0 shadow-lg"
        align="end"
      >
        <div className="space-y-3 p-4">
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
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                <User className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {currentUser?.name || "User"}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-2"
              onClick={onSettings}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="text-destructive h-9 w-full justify-start gap-2 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
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
