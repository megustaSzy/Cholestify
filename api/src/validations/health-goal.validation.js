import Joi from "joi";

export const healthGoalSchema = Joi.object({
  targetWeeklyCalories: Joi.number().min(0).max(50000).required().messages({
    "number.base": "Target kalori mingguan harus berupa angka",
    "number.min": "Target kalori mingguan tidak boleh negatif",
    "number.max": "Target kalori mingguan tidak masuk akal",
    "any.required": "Target kalori mingguan wajib diisi",
  }),

  targetExerciseMins: Joi.number().min(0).max(5000).required().messages({
    "number.base": "Target waktu olahraga harus berupa angka",
    "number.min": "Target waktu olahraga tidak boleh negatif",
    "number.max": "Target waktu olahraga terlalu tinggi",
    "any.required": "Target waktu olahraga wajib diisi",
  }),
});
