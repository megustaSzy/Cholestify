// src/utils/checkConflictUser.js
import { HttpStatus } from "../constants/httpStatus.js";
import { createError } from "./createError.js";

export const checkConflictUser = async (prismaModel, email, message) => {
  const existingUser = await prismaModel.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw createError(HttpStatus.CONFLICT, message);
  }

  return existingUser;
};
