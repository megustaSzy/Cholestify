// src/utils/emailExist.js
import bcrypt from "bcryptjs";
import { HttpStatus } from "../constants/http-status.constant.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";

export const emailExist = async (password, hashedPassword, message) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (!isMatch) {
    throw new BadRequestError(message);
  }

  return true;
};
