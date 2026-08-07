import { model, Schema, Types } from "mongoose";

export type WeeklyReportStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "archived";

export interface IWeeklyReportMetrics {
  openedWorkOrders: number;
  completedWorkOrders: number;
  overdueWorkOrders: number;
  openBacklog: number;
  completionRate: number;
  totalLaborHours: number;
}

export interface IWeeklyReport {
  department: Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  status: WeeklyReportStatus;
  metrics: IWeeklyReportMetrics;
  accomplishments: string[];
  delays: string[];
  recurringProblems: string[];
  nextWeekPriorities: string[];
  managementNotes?: string;
  createdBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
}

const weeklyReportMetricsSchema = new Schema<IWeeklyReportMetrics>(
  {
    openedWorkOrders: {
      type: Number,
      min: 0,
      default: 0,
    },

    completedWorkOrders: {
      type: Number,
      min: 0,
      default: 0,
    },

    overdueWorkOrders: {
      type: Number,
      min: 0,
      default: 0,
    },

    openBacklog: {
      type: Number,
      min: 0,
      default: 0,
    },

    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    totalLaborHours: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const weeklyReportSchema = new Schema<IWeeklyReport>(
  {
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "archived"],
      default: "draft",
    },

    metrics: {
      type: weeklyReportMetricsSchema,
      default: () => ({}),
    },

    accomplishments: {
      type: [String],
      default: [],
    },

    delays: {
      type: [String],
      default: [],
    },

    recurringProblems: {
      type: [String],
      default: [],
    },

    nextWeekPriorities: {
      type: [String],
      default: [],
    },

    managementNotes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

weeklyReportSchema.index({
  department: 1,
  weekStart: -1,
});

weeklyReportSchema.index(
  {
    department: 1,
    weekStart: 1,
    weekEnd: 1,
  },
  {
    unique: true,
  }
);

const WeeklyReport = model<IWeeklyReport>(
  "WeeklyReport",
  weeklyReportSchema
);

export default WeeklyReport;