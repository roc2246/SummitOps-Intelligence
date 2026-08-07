import type { RequestHandler } from "express";
import { Types } from "mongoose";

const isoUtcDateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export interface ValidatedWeeklyReportInput {
  departmentId: string;
  weekStart: Date;
  weekEnd: Date;
}

function parseIsoUtcDate(value: unknown): Date | null {
  if (
    typeof value !== "string" ||
    !isoUtcDateTimePattern.test(value)
  ) {
    return null;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

export const validateWeeklyReport: RequestHandler = (
  request,
  response,
  next
) => {
  const {
    departmentId,
    weekStart,
    weekEnd,
  } = request.body;

  if (
    typeof departmentId !== "string" ||
    !Types.ObjectId.isValid(departmentId)
  ) {
    response.status(400).json({
      success: false,
      message: "Invalid departmentId",
    });

    return;
  }

  if (typeof weekStart !== "string") {
    response.status(400).json({
      success: false,
      message: "weekStart must be an ISO 8601 UTC timestamp",
    });

    return;
  }

  const startDate = parseIsoUtcDate(weekStart);

  if (startDate === null) {
    response.status(400).json({
      success: false,
      message: "weekStart must be an ISO 8601 UTC timestamp",
    });

    return;
  }

  if (typeof weekEnd !== "string") {
    response.status(400).json({
      success: false,
      message: "weekEnd must be an ISO 8601 UTC timestamp",
    });

    return;
  }

  const endDate = parseIsoUtcDate(weekEnd);

  if (endDate === null) {
    response.status(400).json({
      success: false,
      message: "weekEnd must be an ISO 8601 UTC timestamp",
    });

    return;
  }

  if (startDate > endDate) {
    response.status(400).json({
      success: false,
      message: "weekStart must be before weekEnd",
    });

    return;
  }

  response.locals.weeklyReportInput = {
    departmentId,
    weekStart: startDate,
    weekEnd: endDate,
  } satisfies ValidatedWeeklyReportInput;

  next();
};