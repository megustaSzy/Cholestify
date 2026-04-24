import { HttpStatus } from "../constants/httpStatus.js";
import { createError } from "../exceptions/createError.js";

export const notExist = async (prismaModel, where, message) => {
  const data = await prismaModel.findFirst({
    where,
  });

  if (!data) {
    throw createError(HttpStatus.NOT_FOUND, message);
  }

  return data;
};
