"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";

export function SignIn() {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <Unauthenticated>
        <button
          onClick={() => void signIn("google", { redirectTo: "/dashboard" })}
        >
          Sign in
        </button>
      </Unauthenticated>
      <Authenticated>
        <button onClick={handleSignOut}>Sign out</button>
      </Authenticated>
    </>
  );
}
