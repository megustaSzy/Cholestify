"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { HidePasswordInput } from "../HidePasswordInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API } from "@/lib/utils";

type LoginResponse = {
  success: boolean;
  message: string;
  metadata?: {
    status?: number;
  };
  data?: {
    role?: string;
  };
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "Login gagal";
  }

  return "Login gagal";
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Email/no telepon dan password wajib diisi.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await API.post<LoginResponse>("/auth/login", {
        identifier: identifier.trim(),
        password,
      });

      if (response.data.success) {
        router.replace("/user/dashboard");
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseURL = API.defaults.baseURL ?? "";
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-blue-600">
            Login Akun
          </CardTitle>
          <CardDescription>Silahkan Login Akun Anda</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="identifier">Email / No Telepon</FieldLabel>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Masukkan Email atau No Telepon Anda"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <HidePasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Link
                  href="/reset-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-end text-muted-foreground"
                >
                  Lupa Password?
                </Link>
              </Field>
              <Field>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Login"}
                </Button>
                <FieldSeparator className="my-2 [&>span]:bg-card">
                  Atau
                </FieldSeparator>
                <Button
                  className="hover:bg-gray-200"
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  Login Menggunakan Google
                </Button>
                <FieldDescription className="text-center">
                  Belum Punya Akun? <Link href="/signup">Daftar Disini</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
