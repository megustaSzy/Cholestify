import { HttpStatus } from "../constants/http-status.constant.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  const statusCode = Number.isInteger(err.status) ? err.status : 500;

  if (err.response) {
    return res.status(statusCode).json(err.response);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    metadata: {
      status: statusCode,
    },
  });
};
