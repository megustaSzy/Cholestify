import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup - Cholestify",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <SignupForm />
      </div>
    </div>
  );
}
