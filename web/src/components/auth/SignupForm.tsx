"use client";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { API } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { signupSchema } from "@/lib/ValidationAuth";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const golDarah = [
    {
      code: "A",
      label: "A",
    },
    {
      code: "B",
      label: "B",
    },
    {
      code: "AB",
      label: "AB",
    },
    {
      code: "O",
      label: "O",
    },
  ] as const;

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    notelp: "",
    golDarah: "",
    dob: "",
  });

  const passwordMatch = form.password === form.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    const newValue = id === "notelp" ? filterNotelp(value) : value;

    const updatedForm = {
      ...form,
      [id]: newValue,
    };

    setForm(updatedForm);

    // realtime validation
    const result = signupSchema.safeParse(updatedForm);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        // ambil error pertama
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

  const handleGoogleSignup = () => {
    const baseURL = API.defaults.baseURL ?? "";

    window.location.href = `${baseURL}/auth/google`;
  };

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
    // validasi FE
    // if (form.password !== form.confirmPassword) {
    //   const message = "Password dan konfirmasi password tidak sama";
    //   // console.log("VALIDATION FAILED:", message);
    //   setError(message);
    //   toast.error(message);
    //   return;
    // }

    // if (form.password.length < 8) {
    //   const message = "Password minimal 8 karakter";
    //   // console.log("VALIDATION FAILED:", message);
    //   setError(message);
    //   toast.error(message);
    //   return;
    // }

    // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(form.password)) {
    //   const message =
    //     "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol";
    //   // console.log("VALIDATION FAILED:", message);
    //   setError(message);
    //   toast.error(message);
    //   return;
    // }

    // console.log("All validations passed, sending API request...");

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        nama: form.nama,
        email: form.email,
        password: form.password,
        notelp: form.notelp,
        ...(date && { dob: date.toISOString().split("T")[0] }),
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
        confirmPassword: "",
        notelp: "",
        golDarah: "",
        dob: "",
      });
      // redirect setelah sukses
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
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-blue-600">
          Registrasi Akun
        </CardTitle>
        <CardDescription>Daftarkan Akun Anda Sebelum Login</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-200">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="nama">Nama Lengkap</FieldLabel>
              <Input
                id="nama"
                type="text"
                placeholder="John Doe"
                value={form.nama}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.nama && errors.nama && (
                <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.email && errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="notelp">No Telepon</FieldLabel>
              <Input
                id="notelp"
                type="tel"
                placeholder="08xxxxxxxxxx"
                maxLength={13}
                minLength={10}
                value={form.notelp}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.notelp && errors.notelp && (
                <p className="text-xs text-red-500 mt-1">{errors.notelp}</p>
              )}
            </Field>
            <Field className="grid grid-cols-2">
              <FieldLabel htmlFor="tanggalLahir">Tanggal Lahir</FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      id="tanggalLahir"
                      className="w-32 justify-between bg-white hover:bg-white"
                    >
                      <span className={date ? "" : "text-gray-500"}>
                        {date
                          ? date.toISOString().split("T")[0]
                          : "Pilih Tanggal"}
                      </span>
                    </Button>
                  }
                ></PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    disabled={{ after: new Date() }}
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldLabel htmlFor="golDarah">Gol. Darah</FieldLabel>
              <Combobox
                items={golDarah}
                value={form.golDarah}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, golDarah: val as string }))
                }
              >
                <ComboboxInput placeholder="Pilih Gol. Darah" />
                <ComboboxContent>
                  <ComboboxEmpty>Golongan Darah Tidak DItemukan.</ComboboxEmpty>
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
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <HidePasswordInput
                id="password"
                placeholder="••••••••"
                minLength={8}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <div className="flex items-center justify-between">
                <FieldDescription>Minimal 8 karakter</FieldDescription>
                {errors.password && touched.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Konfirmasi Password
              </FieldLabel>
              <HidePasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                minLength={8}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="flex items-center justify-between">
                <FieldDescription>
                  Masukkan Ulang Password Anda.
                </FieldDescription>
                {!passwordMatch && form.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 px-2">
                    Password tidak sama
                  </p>
                )}
              </div>
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  type="submit"
                  disabled={loading}
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
                  onClick={handleGoogleSignup}
                  disabled={loading}
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
