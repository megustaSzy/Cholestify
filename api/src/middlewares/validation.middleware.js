import { BadRequestError } from "../exceptions/BadRequestError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details[0].message;
      return next(new BadRequestError(message));
    }

    req.body = value;
    next();
  };
};
