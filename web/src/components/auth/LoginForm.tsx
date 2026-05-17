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
import { API } from "@/lib/utils";

interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", { identifier: email, password });
      if (data.success) {
        const role = data.data?.role;

        if (role === "USER") {
          router.replace("/user/dashboard");
        }
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className=" text-2xl font-semibold text-blue-600">
            Login Akun
          </CardTitle>
          <CardDescription>Silahkan Login Akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/* Error Message */}
              {error && (
                <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Login
                </Button>
                <FieldSeparator className="my-2 [&>span]:bg-card">
                  Atau
                </FieldSeparator>
                <Button
                  className="hover:bg-gray-200"
                  variant="outline"
                  type="button"
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
