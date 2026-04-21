// src/utils/badRequestId.js
export const badRequestId = (id, message) => {
  if (isNaN(id)) {
    const error = new Error(message);

    error.status = 400;
    error.response = {
      success: false,
      message,
      metadata: {
        status: 400,
      },
    };

    throw error;
  }

  return id;
};
