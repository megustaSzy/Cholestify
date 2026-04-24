// src/exceptions/ConflictError.js
import { HttpStatus } from "../constants/httpStatus.js";

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);

    this.status = HttpStatus.CONFLICT;
    this.response = {
      success: false,
      message,
      metadata: {
        status: HttpStatus.CONFLICT,
      },
    };
  }
}
