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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { HidePasswordInput } from "../HidePasswordInput";
import { useState } from "react";
import { filterNotelp } from "@/lib/script";
import { useRouter } from "next/navigation";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { API } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { signupSchema } from "@/lib/ValidationAuth";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Form } from "@base-ui/react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const golDarah = [
    { code: "A", label: "A" },
    { code: "B", label: "B" },
    { code: "AB", label: "AB" },
    { code: "O", label: "O" },
  ] as const;

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    notelp: "",
    golDarah: "",
    dob: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    const newValue = id === "notelp" ? filterNotelp(value) : value;

    const updatedForm = {
      ...form,
      [id]: newValue,
    };

    setForm(updatedForm);

    const result = signupSchema.safeParse(updatedForm);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.target;

    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // const handleGoogleSignup = () => {
  //   const baseURL = API.defaults.baseURL ?? "";

  //   window.location.href = `${baseURL}/auth/google`;
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = signupSchema.safeParse(form);

    if (!result.success) {
      const message = result.error.issues[0].message;

      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        nama: form.nama,
        email: form.email,
        password: form.password,
        notelp: form.notelp,
        ...(form.dob && { dob: form.dob }),
        ...(form.golDarah && { bloodType: form.golDarah }),
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setForm({
        nama: "",
        email: "",
        password: "",
        notelp: "",
        golDarah: "",
        dob: "",
      });

      toast.success("Registrasi berhasil, silakan login");
      router.replace("/login");
    } catch (err) {
      console.error("API error:", err);

      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Registrasi gagal";
        setError(msg);
        toast.error(msg);
        return;
      }

      setError("Terjadi kesalahan");
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <Card className="w-full shadow-lg border border-slate-200 py-4 rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Daftar Akun
          </CardTitle>

          <CardDescription className="text-slate-600">
            Daftarkan akun Anda sebelum login
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 pb-4">
          <Form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4"
            aria-busy={loading}
          >
            {/* ERROR */}
            {error && (
              <div
                className="
                  rounded-md border border-red-200
                  bg-red-50 px-3 py-2
                  text-sm text-red-700
                  flex items-center gap-2
                "
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* NAMA + EMAIL */}
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="nama"
                  className="text-sm font-semibold text-slate-700"
                >
                  Nama Lengkap
                </FieldLabel>
                <Input
                  id="nama"
                  type="text"
                  placeholder="John Doe"
                  value={form.nama}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  required
                />
                {touched.nama && errors.nama && (
                  <p className="text-sm text-red-600 mt-1">{errors.nama}</p>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  required
                />
                {touched.email && errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </Field>
            </FieldGroup>

            {/* PASSWORD + NOTELP */}
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </FieldLabel>
                <HidePasswordInput
                  id="password"
                  placeholder="••••••••"
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  required
                />
                <div className="flex items-center justify-between">
                  <FieldDescription>Minimal 8 karakter</FieldDescription>
                  {errors.password && touched.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="notelp"
                  className="text-sm font-semibold text-slate-700"
                >
                  No Telepon
                </FieldLabel>
                <Input
                  id="notelp"
                  type="tel"
                  placeholder="08XXXXXXXXXX"
                  maxLength={13}
                  minLength={10}
                  value={form.notelp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  required
                />
                {touched.notelp && errors.notelp && (
                  <p className="text-sm text-red-600 mt-1">{errors.notelp}</p>
                )}
              </Field>
            </FieldGroup>

            {/* TANGGAL LAHIR + GOL DARAH */}
            <FieldGroup>
              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700">
                  Tanggal Lahir
                </FieldLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        type="button"
                        disabled={loading}
                        className="
              w-full justify-start
              bg-white hover:bg-slate-50
              border-slate-300
              text-slate-700 font-normal cursor-pointer
            "
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        <span
                          className={
                            form.dob ? "text-slate-700" : "text-slate-400"
                          }
                        >
                          {form.dob
                            ? new Date(form.dob).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Pilih Tanggal"}
                        </span>
                      </Button>
                    }
                  />
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={form.dob ? new Date(form.dob) : undefined}
                      captionLayout="dropdown"
                      disabled={{ after: new Date() }}
                      onSelect={(date) => {
                        setForm((prev) => ({
                          ...prev,
                          dob: date ? date.toISOString().split("T")[0] : "",
                        }));
                        setTouched((prev) => ({ ...prev, dob: true }));
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {touched.dob && errors.dob && (
                  <p className="text-sm text-red-600 mt-1">{errors.dob}</p>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel className="text-sm font-semibold text-slate-700">
                  Golongan Darah
                </FieldLabel>
                <Combobox
                  items={golDarah}
                  value={form.golDarah}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, golDarah: val as string }))
                  }
                >
                  <ComboboxInput placeholder="Pilih Gol. Darah" />
                  <ComboboxContent>
                    <ComboboxEmpty>
                      Golongan Darah Tidak Ditemukan.
                    </ComboboxEmpty>
                    <ComboboxList>
                      {golDarah.map((item) => (
                        <ComboboxItem key={item.code} value={item.label}>
                          {item.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            </FieldGroup>

            {/* REGISTER BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="
                w-full mt-2
                bg-blue-600 hover:bg-blue-700
                text-white font-medium cursor-pointer
              "
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Loading..." : "Daftar"}
            </Button>

            {/* SEPARATOR */}
            {/* <FieldSeparator className="col-span-2 my-2 [&>span]:bg-card">
              Atau
            </FieldSeparator> */}

            {/* GOOGLE SIGNUP */}
            {/* <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="col-span-2
                w-full
                border border-slate-300
                bg-white
                hover:bg-slate-50
                text-slate-700
                font-medium cursor-pointer
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="mr-2 h-5 w-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l6.2 5.2C39.2 36.7 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>
              Daftar Menggunakan Google
            </Button> */}

            {/* LOGIN */}
            <div className="text-center text-sm text-neutral-600">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Masuk disini
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
