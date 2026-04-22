import { HttpStatus } from "../constants/httpStatus.js";
import { createError } from "./createError.js";

export const badRequestId = (id, message) => {
  if (isNaN(id)) {
    throw createError(HttpStatus.BAD_REQUEST, message);
  }

  return id;
};
