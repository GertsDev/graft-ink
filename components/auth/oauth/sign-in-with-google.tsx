import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "./logos/GoogleLogo";

export function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
    <Button
      onClick={() => void signIn("google", { redirectTo: "/dashboard" })}
      variant="ghost"
      className="h-9 w-full gap-2"
    >
      <GoogleLogo />
      Continue with Google
    </Button>
  );
}
