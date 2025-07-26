import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/_components/ui/button";
import { AppleLogo } from "./logos/apple-logo";

export function SignInWithApple() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("apple", { redirectTo: "/dashboard" })}
    >
      <AppleLogo className="mr-2 h-4 w-4" /> Apple
    </Button>
  );
}
