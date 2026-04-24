// src/utils/checkConflictUser.js
import { HttpStatus } from "../constants/httpStatus.js";
import { ConflictError } from "../exceptions/ConflictError.js";

export const checkConflictUser = async (prismaModel, email, message) => {
  const existingUser = await prismaModel.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ConflictError(message);
  }

  return existingUser;
};
