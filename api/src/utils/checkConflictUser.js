// src/utils/checkConflictUser.js
export const checkConflictUser = async (prismaModel, email, message) => {
  const existingUser = await prismaModel.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    const error = new Error(message);

    error.status = 409;
    error.response = {
      success: false,
      message,
      metadata: {
        status: 409,
      },
    };

    throw error;
  }

  return existingUser;
};
