export const createError = (status, message) => {
  const error = new Error(message);

  error.status = status;
  error.response = {
    success: false,
    message,
    metadata: {
      status,
    },
  };

  return error;
};