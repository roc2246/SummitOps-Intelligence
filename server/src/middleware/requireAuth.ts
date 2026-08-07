import type {
  Request,
  RequestHandler,
} from "express";
import jwt, {
  type JwtPayload,
  type Secret,
} from "jsonwebtoken";

import type {
  UserRole,
} from "../models/index.js";

export interface AuthenticatedRequest
  extends Request {
  authUserId?: string;
  authUserRole?: UserRole;
}

function respondUnauthorized(
  response: Parameters<RequestHandler>[1]
): void {
  response.status(401).json({
    success: false,
    message: "Authentication required",
  });
}

export const requireAuth: RequestHandler = (
  request,
  response,
  next
) => {
  const authHeader =
    request.header("authorization");

  if (
    typeof authHeader !== "string" ||
    !authHeader.startsWith("Bearer ")
  ) {
    respondUnauthorized(response);

    return;
  }

  const token =
    authHeader.slice("Bearer ".length).trim();

  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    respondUnauthorized(response);

    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      jwtSecret as Secret
    );

    if (
      typeof decoded !== "object" ||
      decoded === null
    ) {
      respondUnauthorized(response);

      return;
    }

    const payload =
      decoded as JwtPayload;

    const subject = payload.sub;
    const role = payload.role;

    if (
      typeof subject !== "string" ||
      (role !== "supervisor" &&
        role !== "manager" &&
        role !== "admin")
    ) {
      respondUnauthorized(response);

      return;
    }

    (request as AuthenticatedRequest).authUserId =
      subject;

    (request as AuthenticatedRequest).authUserRole =
      role;

    next();
  } catch {
    respondUnauthorized(response);
  }
};