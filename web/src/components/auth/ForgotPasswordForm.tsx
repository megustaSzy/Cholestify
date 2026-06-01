"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { API } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await API.post("/auth/forgot-password", { email });
      
      // Mengasumsikan API mengembalikan response.data.success = true jika sukses
      if (response.data.success || response.status === 200 || response.status === 201) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(response.data.message || "Gagal mengirim link reset password.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
        );
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="items-center px-4">
      <Card className="w-full">
        {!isSubmitted ? (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Lupa Password
              </CardTitle>

              <CardDescription>
                Masukkan email akun Anda untuk menerima link reset password.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

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
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </Button>

                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Kembali ke Login
                </Link>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="size-10 text-green-600" />
                </div>
              </div>

              <CardTitle className="text-2xl font-semibold text-slate-900">
                Email Terkirim!
              </CardTitle>

              <CardDescription>
                Kami telah mengirimkan link reset password ke email Anda
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                <AlertDescription>
                  Periksa inbox email{" "}
                  <span className="font-semibold">{email}</span> dan klik link
                  reset password.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsSubmitted(false)}
                >
                  Kirim Ulang Email
                </Button>

                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Kembali ke Login
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
