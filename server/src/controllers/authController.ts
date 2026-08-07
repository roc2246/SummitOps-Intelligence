import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { compare } from "bcryptjs";
import jwt, {
  type Secret,
  type SignOptions,
} from "jsonwebtoken";

import {
  AppError,
} from "../utils/AppError.js";

import {
  findActiveUserByEmailWithPasswordHash,
} from "../services/index.js";

export async function loginPlaceholder(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      email,
      password,
    } = request.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim() === "" ||
      password === ""
    ) {
      response.status(400).json({
        success: false,
        message: "Email and password are required",
      });

      return;
    }

    const user =
      await findActiveUserByEmailWithPasswordHash(email);

    if (!user?.passwordHash) {
      response.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

      return;
    }

    const passwordMatches = await compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      response.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError(
        500,
        "JWT_SECRET is not configured"
      );
    }

    const expiresIn =
      (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"];

    const token = jwt.sign(
      {
        sub: String(user._id),
        role: user.role,
      },
      jwtSecret as Secret,
      {
        expiresIn,
      }
    );

    response.status(200).json({
      success: true,
      token,

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