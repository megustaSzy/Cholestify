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
    .required()
    .messages({
      "string.empty": "Nama harus diisi",
      "string.min": "Nama minimal 3 karakter",
      "string.max": "Nama maksimal 50 karakter",
      "string.pattern.base": "Nama hanya boleh huruf dan spasi",
    }),

  email: emailSchema,
  password: passwordSchema,

  notelp: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(13)
    .required()
    .messages({
      "string.empty": "No telepon harus diisi",
      "string.pattern.base": "No telepon hanya boleh angka",
      "string.min": "No telepon minimal 10 digit",
      "string.max": "No telepon maksimal 13 digit",
    }),
});

export const authLoginSchema = Joi.object({
  email: emailSchema,
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
