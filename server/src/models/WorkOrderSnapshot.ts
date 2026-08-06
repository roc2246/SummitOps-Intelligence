import { model, Schema, Types } from "mongoose";

export type WorkOrderSource = "maintainx" | "csv" | "manual";

export type WorkOrderPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type WorkOrderStatus =
  | "open"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface IWorkOrderSnapshot {
  externalId: string;
  source: WorkOrderSource;
  department: Types.ObjectId;
  title: string;
  category?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  location?: string;
  createdAtSource: Date;
  dueDateSource?: Date;
  completedAtSource?: Date;
  laborHours: number;
  snapshotDate: Date;
}

const workOrderSnapshotSchema = new Schema<IWorkOrderSnapshot>(
  {
    externalId: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      enum: ["maintainx", "csv", "manual"],
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "on_hold",
        "completed",
        "cancelled",
      ],
      default: "open",
    },

    location: {
      type: String,
      trim: true,
    },

    createdAtSource: {
      type: Date,
      required: true,
    },

    dueDateSource: {
      type: Date,
    },

    completedAtSource: {
      type: Date,
    },

    laborHours: {
      type: Number,
      min: 0,
      default: 0,
    },

    snapshotDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

workOrderSnapshotSchema.index({
  department: 1,
  snapshotDate: -1,
});

workOrderSnapshotSchema.index({
  externalId: 1,
  source: 1,
});

const WorkOrderSnapshot = model<IWorkOrderSnapshot>(
  "WorkOrderSnapshot",
  workOrderSnapshotSchema
);

export default WorkOrderSnapshot;