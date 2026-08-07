import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { Types } from "mongoose";

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
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pageQuery = request.query.page;
    const limitQuery = request.query.limit;
    const departmentIdQuery = request.query.departmentId;
    const weekStartFromQuery = request.query.weekStartFrom;
    const weekStartToQuery = request.query.weekStartTo;

    const parsedPage =
      typeof pageQuery === "string"
        ? Number.parseInt(pageQuery, 10)
        : 1;

    const parsedLimit =
      typeof limitQuery === "string"
        ? Number.parseInt(limitQuery, 10)
        : 20;

    const page =
      Number.isFinite(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;

    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 20;

    if (
      typeof departmentIdQuery === "string" &&
      !Types.ObjectId.isValid(departmentIdQuery)
    ) {
      response.status(400).json({
        success: false,
        message: "Invalid departmentId",
      });

      return;
    }

    const weekStartFrom =
      typeof weekStartFromQuery === "string"
        ? new Date(weekStartFromQuery)
        : undefined;

    if (
      weekStartFrom !== undefined &&
      Number.isNaN(weekStartFrom.getTime())
    ) {
      response.status(400).json({
        success: false,
        message: "Invalid weekStartFrom",
      });

      return;
    }

    const weekStartTo =
      typeof weekStartToQuery === "string"
        ? new Date(weekStartToQuery)
        : undefined;

    if (
      weekStartTo !== undefined &&
      Number.isNaN(weekStartTo.getTime())
    ) {
      response.status(400).json({
        success: false,
        message: "Invalid weekStartTo",
      });

      return;
    }

    if (
      weekStartFrom &&
      weekStartTo &&
      weekStartFrom > weekStartTo
    ) {
      response.status(400).json({
        success: false,
        message:
          "weekStartFrom must be before or equal to weekStartTo",
      });

      return;
    }

    const reports =
      await getWeeklyReports({
        page,
        limit,
        departmentId:
          typeof departmentIdQuery === "string"
            ? departmentIdQuery
            : undefined,
        weekStartFrom,
        weekStartTo,
      });

    response.status(200).json(
      reports
    );
  } catch (error) {
    next(error);
  }
}