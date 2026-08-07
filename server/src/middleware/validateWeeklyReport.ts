import type { RequestHandler } from "express";
import { Types } from "mongoose";

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

  if (
    typeof weekStart !== "string" ||
    Number.isNaN(Date.parse(weekStart))
  ) {
    response.status(400).json({
      success: false,
      message: "Invalid weekStart",
    });

    return;
  }

  if (
    typeof weekEnd !== "string" ||
    Number.isNaN(Date.parse(weekEnd))
  ) {
    response.status(400).json({
      success: false,
      message: "Invalid weekEnd",
    });

    return;
  }

  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);

  if (startDate > endDate) {
    response.status(400).json({
      success: false,
      message: "weekStart must be before weekEnd",
    });

    return;
  }

  next();
};