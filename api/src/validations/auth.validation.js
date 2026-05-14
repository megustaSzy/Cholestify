import Joi from "joi";

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email()
  .required()
  .messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
  });

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
  .required()
  .messages({
    "string.empty": "Password harus diisi",
    "string.min": "Password minimal 8 karakter",
    "string.pattern.base":
      "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol",
  });

export const authRegisterSchema = Joi.object({
  nama: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z\s]+$/)
    .required(),

  email: emailSchema,
  password: passwordSchema,

  notelp: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(13)
    .required(),

  dob: Joi.date().optional(),

  bloodType: Joi.string().valid("A", "B", "AB", "O").optional(),
});

export const authLoginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "Email atau nomor telepon harus diisi",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password harus diisi",
  }),
});

export const authForgotSchema = Joi.object({
  email: emailSchema,
});

export const authResetPasswordSchema = Joi.object({
  password: passwordSchema,

  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Konfirmasi password tidak cocok",
    "any.required": "Konfirmasi password harus diisi",
  }),
});

export const authResetTokenQuerySchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token harus diisi",
  }),
});
