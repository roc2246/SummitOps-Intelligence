import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  findActiveUserByEmail,
} from "../services/index.js";

export async function loginPlaceholder(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      email,
    } = request.body;

    if (typeof email !== "string") {
      response.status(400).json({
        success: false,
        message: "Email is required",
      });

      return;
    }

    const user =
      await findActiveUserByEmail(email);

    if (!user) {
      response.status(401).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    response.status(200).json({
      success: true,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}