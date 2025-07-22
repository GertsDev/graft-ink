"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GoogleLogo } from "./logos/GoogleLogo";
import { Separator } from "@radix-ui/react-separator";
import { SignInWithGoogle } from "./SignInWithGoogle";

export default function AuthDropdown() {
  const [open, setOpen] = useState(false);

  const handleGoogleSignIn = () => {
    // Handle Google authentication here
    console.log("Google sign-in clicked");
    setOpen(false);
  };

  return (
    <div className="flex justify-center items-center ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="gap-2 text-md  ">
            Sign In
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-4 rounded-xl shadow-lg mt-0"
          align="end"
        >
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-semibold text-sm">Sign in to your account</h3>
            </div>
            <Separator className="my-2 border-1" />

            <SignInWithGoogle />

            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our Terms of Service
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
