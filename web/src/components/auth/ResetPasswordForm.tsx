"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // request API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-6">
          {!isSubmitted ? (
            <>
              <div className="mb-6 space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-blue-600">
                  Lupa Password
                </h1>

                <p className="text-sm text-muted-foreground">
                  Masukkan email akun Anda untuk menerima link reset password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}

                  {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="mr-1 size-4" />
                  Kembali ke login
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border bg-muted">
                <Mail className="size-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Cek Email Anda</h2>

                <p className="text-sm text-muted-foreground">
                  Kami telah mengirim link reset password ke{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <Button render={<Link href="/login" />} className="w-full">
                Kembali ke Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
