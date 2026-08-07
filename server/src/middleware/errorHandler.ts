import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

import { AppError } from "../utils/AppError.js";

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  console.error(error);

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({
      success: false,
      message: `Invalid ${error.path}`,
    });

    return;
  }

  if (isDuplicateKeyError(error)) {
    response.status(409).json({
      success: false,
      message: "A report already exists for that department and week.",
    });

    return;
  }

  response.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
