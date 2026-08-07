import type {
  RequestHandler,
} from "express";

import type {
  UserRole,
} from "../models/index.js";

import type {
  AuthenticatedRequest,
} from "./requireAuth.js";

export function requireRole(
  ...allowedRoles: UserRole[]
): RequestHandler {
  return (
    request,
    response,
    next
  ) => {
    const role =
      (request as AuthenticatedRequest)
        .authUserRole;

    if (
      !role ||
      !allowedRoles.includes(role)
    ) {
      response.status(403).json({
        success: false,
        message: "Forbidden",
      });

      return;
    }

    next();
  };
}