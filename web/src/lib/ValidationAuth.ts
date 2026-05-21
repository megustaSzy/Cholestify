import { z } from "zod";

export const signupSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .regex(/^[A-Za-z\s]+$/, "Nama hanya boleh huruf dan spasi"),

  email: z.email("Format email tidak valid"),

  notelp: z
    .string()
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh angka")
    .min(10, "Nomor telepon minimal 10 karakter")
    .max(13, "Nomor telepon maksimal 13 karakter"),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol",
    ),

  golDarah: z.enum(["A", "B", "AB", "O"]).optional(),

  dob: z.string().optional(),
});
