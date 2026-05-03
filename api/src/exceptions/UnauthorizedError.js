// src/exceptions/UnauthorizedError.js
import { HttpStatus } from "../constants/http-status.constant.js";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);

    this.status = HttpStatus.UNAUTHORIZED;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.UNAUTHORIZED,
      },
    };
  }
}
