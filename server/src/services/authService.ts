import {
  User,
} from "../models/index.js";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findActiveUserByEmail(
  email: string
) {
  const normalizedEmail =
    normalizeEmail(email);

  const user = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  return user;
}

export async function findActiveUserByEmailWithPasswordHash(
  email: string
) {
  const normalizedEmail =
    normalizeEmail(email);

  return User.findOne({
    email: normalizedEmail,
    isActive: true,
  }).select("+passwordHash");
}