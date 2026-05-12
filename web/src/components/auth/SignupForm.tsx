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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-blue-600">
          Registrasi Akun
        </CardTitle>
        <CardDescription>Daftarkan Akun Anda Sebelum Login</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <HidePasswordInput
                id="password"
                placeholder="••••••••"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <HidePasswordInput
                id="password"
                placeholder="••••••••"
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  type="submit"
                >
                  Daftar
                </Button>
                <FieldSeparator className="my-2 [&>span]:bg-card">
                  Atau
                </FieldSeparator>
                <Button
                  className="hover:bg-gray-200"
                  variant="outline"
                  type="button"
                >
                  Daftar Menggunakan Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Sudah Punya Akun? <Link href="/login">Login Disini</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
