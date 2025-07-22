import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";

export function SignIn() {
  const { signIn, signOut } = useAuthActions();
  return (
    <>
      <Unauthenticated>
        <button onClick={() => void signIn("google")}>Sign in</button>
      </Unauthenticated>
      <Authenticated>
        <button onClick={() => void signOut()}>Sign out</button>
      </Authenticated>
    </>
  );
}
