// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  if (err.response) {
    return res.status(err.status).json(err.response);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    metadata: {
      status: 500,
    },
  });
};
