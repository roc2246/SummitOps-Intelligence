import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  generateWeeklyReport,
  getWeeklyReports,
} from "../services/index.js";

import type {
  ValidatedWeeklyReportInput,
} from "../middleware/validateWeeklyReport.js";

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
    } = res.locals
      .weeklyReportInput as ValidatedWeeklyReportInput;

    const report = await generateWeeklyReport(
      departmentId,
      weekStart,
      weekEnd
    );

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

export async function listWeeklyReports(
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reports =
      await getWeeklyReports();

    response.status(200).json(
      reports
    );
  } catch (error) {
    next(error);
  }
}