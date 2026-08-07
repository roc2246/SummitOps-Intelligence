import {
  WeeklyReport,
  WorkOrderSnapshot,
} from "../models/index.js";

import { calculateWeeklyMetrics } from "./analyticsService.js";

export async function generateWeeklyReport(
  departmentId: string,
  weekStart: Date,
  weekEnd: Date
) {
  const workOrders = await WorkOrderSnapshot.find({
    department: departmentId,
    createdAtSource: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  });

  const metrics = calculateWeeklyMetrics(workOrders);

  const report = await WeeklyReport.create({
    department: departmentId,
    weekStart,
    weekEnd,
    metrics,
  });

  return report;
}