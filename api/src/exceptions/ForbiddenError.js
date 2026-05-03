// src/exceptions/ForbiddenError.js
import { HttpStatus } from "../constants/http-status.constant.js";

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);

    this.status = HttpStatus.FORBIDDEN;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.FORBIDDEN,
      },
    };
  }
}
