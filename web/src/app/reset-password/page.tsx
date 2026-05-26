import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { ResetPasswordSkeleton } from "@/components/auth/ResetPasswordSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password - Cholestify",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<ResetPasswordSkeleton />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
