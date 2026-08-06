import { model, Schema } from "mongoose";

export interface IDepartment {
  name: string;
  description?: string;
  isActive: boolean;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Department = model<IDepartment>("Department", departmentSchema);

export default Department;
