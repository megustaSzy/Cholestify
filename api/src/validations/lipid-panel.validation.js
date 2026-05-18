import Joi from "joi";

export const createLipidPanelSchema = Joi.object({
  date: Joi.date().iso().required().messages({
    "date.base": "Format tanggal tidak valid",
    "date.format": "Tanggal harus menggunakan format ISO",
    "any.required": "Tanggal pemeriksaan wajib diisi",
  }),

  totalCholesterol: Joi.number().min(0).max(1000).required().messages({
    "number.base": "Total kolesterol harus berupa angka",
    "number.min": "Total kolesterol tidak boleh negatif",
    "number.max": "Nilai total kolesterol tidak valid atau terlalu tinggi",
    "any.required": "Total kolesterol wajib diisi",
  }),

  ldl: Joi.number().min(0).max(1000).required().messages({
    "number.base": "LDL harus berupa angka",
    "number.min": "LDL tidak boleh negatif",
    "number.max": "Nilai LDL tidak valid atau terlalu tinggi",
    "any.required": "LDL wajib diisi",
  }),

  hdl: Joi.number().min(0).max(300).required().messages({
    "number.base": "HDL harus berupa angka",
    "number.min": "HDL tidak boleh negatif",
    "number.max": "Nilai HDL tidak valid atau terlalu tinggi",
    "any.required": "HDL wajib diisi",
  }),

  triglycerides: Joi.number().min(0).max(3000).required().messages({
    "number.base": "Trigliserida harus berupa angka",
    "number.min": "Trigliserida tidak boleh negatif",
    "number.max": "Nilai trigliserida tidak valid atau terlalu tinggi",
    "any.required": "Trigliserida wajib diisi",
  }),
});

export const updateLipidPanelSchema = Joi.object({
  date: Joi.date().iso().optional().messages({
    "date.base": "Format tanggal tidak valid",
    "date.format": "Tanggal harus menggunakan format ISO",
  }),

  totalCholesterol: Joi.number().min(0).max(1000).optional().messages({
    "number.base": "Total kolesterol harus berupa angka",
    "number.min": "Total kolesterol tidak boleh negatif",
    "number.max": "Nilai total kolesterol tidak valid atau terlalu tinggi",
  }),

  ldl: Joi.number().min(0).max(1000).optional().messages({
    "number.base": "LDL harus berupa angka",
    "number.min": "LDL tidak boleh negatif",
    "number.max": "Nilai LDL tidak valid atau terlalu tinggi",
  }),

  hdl: Joi.number().min(0).max(300).optional().messages({
    "number.base": "HDL harus berupa angka",
    "number.min": "HDL tidak boleh negatif",
    "number.max": "Nilai HDL tidak valid atau terlalu tinggi",
  }),

  triglycerides: Joi.number().min(0).max(3000).optional().messages({
    "number.base": "Trigliserida harus berupa angka",
    "number.min": "Trigliserida tidak boleh negatif",
    "number.max": "Nilai trigliserida tidak valid atau terlalu tinggi",
  }),
});
