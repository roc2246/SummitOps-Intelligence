import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  generateWeeklyReport,
} from "../services/index.js";

export async function createWeeklyReport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      departmentId,
      weekStart,
      weekEnd,
    } = req.body;

    const report = await generateWeeklyReport(
      departmentId,
      new Date(weekStart),
      new Date(weekEnd)
    );

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}