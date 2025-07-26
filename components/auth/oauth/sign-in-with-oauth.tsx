import { SignInWithApple } from "./signIn-with-apple";
import { SignInWithGitHub } from "./sign-in-with-github";
import { SignInWithGoogle } from "./sign-in-with-google";

export function SignInWithOAuth() {
  return (
    <div className="flex w-full flex-col items-stretch gap-2 min-[460px]:flex-row">
      <SignInWithGitHub />
      <SignInWithGoogle />
      <SignInWithApple />
    </div>
  );
}
