import type { RequestHandler } from "express";
import { Types } from "mongoose";

const isoUtcDateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export interface ValidatedWeeklyReportInput {
  departmentId: string;
  weekStart: Date;
  weekEnd: Date;
}

/**
 * Parses a strict ISO 8601 UTC timestamp used by the weekly-report payload.
 * Expected format: YYYY-MM-DDTHH:mm:ss.sssZ
 */
function parseIsoUtcDate(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue =
    isoDatePattern.test(value)
      ? `${value}T00:00:00.000Z`
      : value;

  if (!isoUtcDateTimePattern.test(normalizedValue)) {
    return null;
  }

  const parsedDate = new Date(normalizedValue);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

/**
 * Validates weekly report creation payload and stores a typed result on response.locals.
 * This middleware enforces ObjectId department references and strict UTC timestamps
 * to keep backend date behavior predictable across time zones.
 */
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