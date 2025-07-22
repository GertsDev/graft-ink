import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "./logos/GoogleLogo";

export function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
    <Button
      onClick={() => void signIn("google")}
      variant="ghost"
      className="w-full gap-2 h-9 "
    >
      <GoogleLogo />
      Continue with Google
    </Button>
  );
}
