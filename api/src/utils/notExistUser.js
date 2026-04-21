// src/utils/notExistUser.js
export const notExistUser = async (prismaModel, id, message) => {
  const data = await prismaModel.findUnique({
    where: {
      id: id,
    },
  });

  if (!data) {
    const error = new Error(message);

    error.status = 404;
    error.response = {
      success: false,
      message: message,
      metadata: {
        status: 404,
      },
    };

    throw error;
  }

  return data;
};
