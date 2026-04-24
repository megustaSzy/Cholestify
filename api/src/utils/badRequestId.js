import { HttpStatus } from "../constants/httpStatus.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";

export const badRequestId = (id, message) => {
  if (isNaN(id)) {
    throw new BadRequestError(message);
  }

  return id;
};
