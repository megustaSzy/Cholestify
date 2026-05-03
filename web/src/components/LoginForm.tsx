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
import { PasswordInput } from "./PasswordInput";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Login Akun</CardTitle>
          <CardDescription>Silahkan Login Akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <PasswordInput id="password" required />
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-end text-muted-foreground"
                >
                  Forgot your password?
                </Link>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldSeparator className="my-2">Atau</FieldSeparator>
                <Button variant="outline" type="button">
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
    </div>
  );
}
