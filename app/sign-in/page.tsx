import { SignInForm } from "@/components/auth/sing-in-form";

export default function SignInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md p-6">
        <SignInForm />
      </div>
    </main>
  );
} 