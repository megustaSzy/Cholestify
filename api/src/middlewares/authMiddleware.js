import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(new UnauthorizedError(process.env.TOKEN_BAD_REQUEST));
  }
};
