import { SignInWithOAuth } from "./oauth/sign-in-with-oauth";

export function SignInForm() {
  return (
    <div className="mx-auto flex max-w-[384px] flex-col gap-4">
      <>
        <h2 className="text-2xl font-semibold tracking-tight">
          Sign in or create an account
        </h2>
        <SignInWithOAuth />
      </>
    </div>
  );
}
