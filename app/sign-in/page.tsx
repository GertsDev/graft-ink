"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { SignInWithGoogle } from "../../shared/components/auth/oauth/sign-in-with-google";

export default function SignInPage() {
  return (
    <div className="from-background via-background to-muted/20 flex items-center justify-center bg-gradient-to-br p-4 flex-1">
      <div className=" w-full max-w-md">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </motion.div>

        {/* Main sign-in card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/50 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm"
        >
          {/* Graft logo/brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-primary mb-2 text-4xl font-bold">GRAFT</h1>
            <p className="text-muted-foreground text-sm">
              Your way to productivity
            </p>
          </motion.div>

          {/* Sign-in form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse opacity-20"></div>
              <div className="absolute inset-0 rounded-lg">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
              </div>
              <div className="relative">
                <SignInWithGoogle />
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="text-muted-foreground flex items-center justify-center gap-6 text-xs">
              <span>✓ Secure & Private</span>
              <span>✓ No credit card</span>
              <span>✓ Free forever</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-muted-foreground mt-6 text-center text-xs"
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </div>
    </div>
  );
}
