import {
  User,
} from "../models/index.js";

export async function findActiveUserByEmail(
  email: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  return user;
}