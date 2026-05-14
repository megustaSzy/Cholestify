import Joi from "joi";

export const heartRateSchema = Joi.object({
  dob: Joi.date().max("now").required().messages({
    "date.base": "Tanggal lahir tidak valid",

    "date.max": "Tanggal lahir tidak boleh lebih dari hari ini",

    "any.required": "Tanggal lahir wajib diisi",
  }),

  gender: Joi.string().valid("MALE", "FEMALE").required().messages({
    "any.only": "Jenis kelamin tidak valid",

    "any.required": "Jenis kelamin wajib diisi",
  }),

  restingHeartRate: Joi.number().min(30).max(220).required().messages({
    "number.base": "Detak jantung harus berupa angka",

    "number.min": "Detak jantung terlalu rendah",

    "number.max": "Detak jantung terlalu tinggi",

    "any.required": "Detak jantung wajib diisi",
  }),

  activityLevel: Joi.string()
    .valid("INACTIVE", "LIGHTLY_ACTIVE", "ACTIVE", "ATHLETE")
    .required()
    .messages({
      "any.only": "Aktivitas harian tidak valid",

      "any.required": "Aktivitas harian wajib diisi",
    }),
});
