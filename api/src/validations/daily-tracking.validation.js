import Joi from "joi";

export const createDailyTrackingValidation = Joi.object({
  calories: Joi.number().integer().min(0).required(),
  protein: Joi.number().integer().min(0).required(),
  exerciseMins: Joi.number().integer().min(0).required(),
  foodNotes: Joi.string().allow("").optional(),
});
