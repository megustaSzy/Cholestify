// src/utils/emailExist.js
import bcrypt from "bcryptjs";
import { createError } from "./createError.js";
import { HttpStatus } from "../constants/httpStatus.js";

export const emailExist = async (password, hashedPassword, message) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (!isMatch) {
    throw createError(HttpStatus.BAD_REQUEST, message);
  }

  return true;
};
