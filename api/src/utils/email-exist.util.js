import bcrypt from "bcryptjs";
import { BadRequestError } from "../exceptions/BadRequestError.js";

export const emailExist = async (password, hashedPassword, message) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (!isMatch) {
    throw new BadRequestError(message);
  }

  return true;
};
