import { HttpStatus } from "../constants/httpStatus.js";

export const errorHandler = (err, req, res, next) => {
  if (err.response) {
    return res.status(err.status).json(err.response);
  }

  console.error(err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    metadata: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  });
};
