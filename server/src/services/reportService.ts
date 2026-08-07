import {
  Department,
  WeeklyReport,
  WorkOrderSnapshot,
} from "../models/index.js";

import { calculateWeeklyMetrics } from "./analyticsService.js";
import { AppError } from "../utils/AppError.js";

export async function generateWeeklyReport(
  departmentId: string,
  weekStart: Date,
  weekEnd: Date
) {
  const departmentExists = await Department.exists({
    _id: departmentId,
  });

  if (departmentExists === null) {
    throw new AppError(404, "Department not found");
  }

  const workOrders = await WorkOrderSnapshot.find({
    department: departmentId,
    createdAtSource: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  });

  const metrics = calculateWeeklyMetrics(
    workOrders,
    weekEnd,
  );

  const report = await WeeklyReport.create({
    department: departmentId,
    weekStart,
    weekEnd,
    metrics,
  });

  return report;
}

export async function getWeeklyReports() {
  return WeeklyReport.find().sort({
    weekStart: -1,
  });
}