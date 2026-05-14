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
import { filterNotelp, formatDate } from "@/lib/script";
import { Form } from "@base-ui/react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

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
    tanggalLahir: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    let value = e.target.value;

    if (id === "notelp") {
      value = filterNotelp(value);
    }
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const isPasswordMatch = form.password === form.confirmPassword;

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-blue-600">
          Registrasi Akun
        </CardTitle>
        <CardDescription>Daftarkan Akun Anda Sebelum Login</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Test");
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nama">Nama Lengkap</FieldLabel>
              <Input
                id="nama"
                type="text"
                placeholder="John Doe"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="notelp">No Telepon</FieldLabel>
              <Input
                id="notelp"
                type="tel"
                placeholder="08xxxxxxxxxx"
                maxLength={13}
                minLength={11}
                value={form.notelp}
                onChange={handleChange}
                required
              />
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
                          ? formatDate(date.toISOString().split("T")[0])
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
              <Combobox items={golDarah}>
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
                required
              />
              <FieldDescription>Minimal 8 karakter</FieldDescription>
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
                {!isPasswordMatch && form.confirmPassword && (
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
        </Form>
      </CardContent>
    </Card>
  );
}
