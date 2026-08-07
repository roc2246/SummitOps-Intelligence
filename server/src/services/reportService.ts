import {
  Department,
  WeeklyReport,
  WorkOrderSnapshot,
} from "../models/index.js";

import type {
  IWeeklyReport,
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

export interface GetWeeklyReportsOptions {
  page: number;
  limit: number;
  departmentId?: string;
  weekStartFrom?: Date;
  weekStartTo?: Date;
}

export interface GetWeeklyReportsResult {
  data: IWeeklyReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getWeeklyReports(
  options: GetWeeklyReportsOptions
): Promise<GetWeeklyReportsResult> {
  const {
    page,
    limit,
    departmentId,
    weekStartFrom,
    weekStartTo,
  } = options;

  const query: {
    department?: string;
    weekStart?: {
      $gte?: Date;
      $lte?: Date;
    };
  } = {};

  if (departmentId) {
    query.department = departmentId;
  }

  if (weekStartFrom || weekStartTo) {
    query.weekStart = {};

    if (weekStartFrom) {
      query.weekStart.$gte = weekStartFrom;
    }

    if (weekStartTo) {
      query.weekStart.$lte = weekStartTo;
    }
  }

  const total = await WeeklyReport.countDocuments(query);

  const reports = await WeeklyReport.find(query)
    .sort({
      weekStart: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    data: reports as IWeeklyReport[],
    pagination: {
      page,
      limit,
      total,
      totalPages:
        total === 0
          ? 0
          : Math.ceil(total / limit),
    },
  };
}