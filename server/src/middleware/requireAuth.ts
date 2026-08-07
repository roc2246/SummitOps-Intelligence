import type {
  Request,
  RequestHandler,
} from "express";

import {
  Types,
} from "mongoose";

export interface AuthenticatedRequest
  extends Request {
  authUserId?: string;
}

export const requireAuth: RequestHandler = (
  request,
  response,
  next
) => {
  const userId =
    request.header("x-user-id");

  if (
    !userId ||
    !Types.ObjectId.isValid(userId)
  ) {
    response.status(401).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  (
    request as AuthenticatedRequest
  ).authUserId = userId;

  next();
};