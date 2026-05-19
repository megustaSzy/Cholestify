import { BadRequestError } from "../exceptions/BadRequestError.js";

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    req.validatedQuery = value;

    next();
  };
};
