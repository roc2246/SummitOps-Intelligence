import { model, Schema } from "mongoose";

export type UserRole = "supervisor" | "manager" | "admin";

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["supervisor", "manager", "admin"],
      default: "supervisor",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>("User", userSchema);

export default User;
