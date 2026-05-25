import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { ResetPasswordSkeleton } from "@/components/auth/ResetPasswordSkeleton";
import { Suspense } from "react";

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
