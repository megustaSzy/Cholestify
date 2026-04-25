import { NotFoundError } from "../exceptions/NotFoundError.js";

export const notExist = async (prismaModel, where, message) => {
  const data = await prismaModel.findFirst({
    where,
  });

  if (!data) {
    throw new NotFoundError(message);
  }

  return data;
};
