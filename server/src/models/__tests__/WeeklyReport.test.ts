import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Error as MongooseError, Types } from "mongoose";

import WeeklyReport from "../WeeklyReport.js";

async function getValidationError(document: {
  validate: () => Promise<void>;
}): Promise<MongooseError.ValidationError | undefined> {
  try {
    await document.validate();
    return undefined;
  } catch (error) {
    return error as MongooseError.ValidationError;
  }
}

describe("WeeklyReport model", () => {
  const departmentId = new Types.ObjectId();
  const userId = new Types.ObjectId();

  const weekStart = new Date("2026-08-03T00:00:00.000Z");
  const weekEnd = new Date("2026-08-09T23:59:59.999Z");

  it("creates a valid weekly report", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,
      status: "submitted",

      metrics: {
        openedWorkOrders: 24,
        completedWorkOrders: 19,
        overdueWorkOrders: 3,
        openBacklog: 8,
        completionRate: 79,
        totalLaborHours: 146,
      },

      accomplishments: [
        "Completed drainage work near Lot C",
        "Finished mowing the main base area",
      ],

      delays: [
        "Rain delayed landscaping work",
      ],

      recurringProblems: [
        "Repeated drainage issues near Lot C",
      ],

      nextWeekPriorities: [
        "Complete parking-lot repairs",
      ],

      managementNotes: "Overall productivity remained strong.",
      createdBy: userId,
    });

    const validationError = await getValidationError(report);

    assert.equal(validationError, undefined);

    assert.deepEqual(report.department, departmentId);
    assert.deepEqual(report.weekStart, weekStart);
    assert.deepEqual(report.weekEnd, weekEnd);

    assert.equal(report.status, "submitted");

    assert.equal(report.metrics.openedWorkOrders, 24);
    assert.equal(report.metrics.completedWorkOrders, 19);
    assert.equal(report.metrics.overdueWorkOrders, 3);
    assert.equal(report.metrics.openBacklog, 8);
    assert.equal(report.metrics.completionRate, 79);
    assert.equal(report.metrics.totalLaborHours, 146);

    assert.equal(report.accomplishments.length, 2);
    assert.equal(report.delays.length, 1);
    assert.equal(report.recurringProblems.length, 1);
    assert.equal(report.nextWeekPriorities.length, 1);

    assert.equal(
      report.managementNotes,
      "Overall productivity remained strong."
    );

    assert.deepEqual(report.createdBy, userId);
  });

  it("applies default values", () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,
    });

    assert.equal(report.status, "draft");

    assert.equal(report.metrics.openedWorkOrders, 0);
    assert.equal(report.metrics.completedWorkOrders, 0);
    assert.equal(report.metrics.overdueWorkOrders, 0);
    assert.equal(report.metrics.openBacklog, 0);
    assert.equal(report.metrics.completionRate, 0);
    assert.equal(report.metrics.totalLaborHours, 0);

    assert.deepEqual(report.accomplishments, []);
    assert.deepEqual(report.delays, []);
    assert.deepEqual(report.recurringProblems, []);
    assert.deepEqual(report.nextWeekPriorities, []);
  });

  it("trims management notes", () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,
      managementNotes: "  Review equipment availability next week.  ",
    });

    assert.equal(
      report.managementNotes,
      "Review equipment availability next week."
    );
  });

  it("allows optional approval fields to be omitted", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,
    });

    const validationError = await getValidationError(report);

    assert.equal(validationError, undefined);
    assert.equal(report.createdBy, undefined);
    assert.equal(report.approvedBy, undefined);
    assert.equal(report.approvedAt, undefined);
  });

  it("rejects a report without a department", async () => {
    const report = new WeeklyReport({
      weekStart,
      weekEnd,
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.department);
    assert.equal(
      validationError.errors.department.kind,
      "required"
    );
  });

  it("rejects a report without a week start date", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekEnd,
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.weekStart);
    assert.equal(
      validationError.errors.weekStart.kind,
      "required"
    );
  });

  it("rejects a report without a week end date", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.weekEnd);
    assert.equal(
      validationError.errors.weekEnd.kind,
      "required"
    );
  });

  it("rejects an unsupported report status", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,
      status: "published",
    } as unknown as {
      department: Types.ObjectId;
      weekStart: Date;
      weekEnd: Date;
      status: "draft";
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.status);
    assert.equal(validationError.errors.status.kind, "enum");
  });

  it("rejects negative work-order metrics", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,

      metrics: {
        openedWorkOrders: -1,
      },
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);

    assert.ok(
      validationError.errors["metrics.openedWorkOrders"]
    );

    assert.equal(
      validationError.errors["metrics.openedWorkOrders"].kind,
      "min"
    );
  });

  it("rejects negative labor hours", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,

      metrics: {
        totalLaborHours: -5,
      },
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);

    assert.ok(
      validationError.errors["metrics.totalLaborHours"]
    );

    assert.equal(
      validationError.errors["metrics.totalLaborHours"].kind,
      "min"
    );
  });

  it("rejects a completion rate below zero", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,

      metrics: {
        completionRate: -1,
      },
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);

    assert.ok(
      validationError.errors["metrics.completionRate"]
    );

    assert.equal(
      validationError.errors["metrics.completionRate"].kind,
      "min"
    );
  });

  it("rejects a completion rate above 100", async () => {
    const report = new WeeklyReport({
      department: departmentId,
      weekStart,
      weekEnd,

      metrics: {
        completionRate: 101,
      },
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);

    assert.ok(
      validationError.errors["metrics.completionRate"]
    );

    assert.equal(
      validationError.errors["metrics.completionRate"].kind,
      "max"
    );
  });

  it("rejects an invalid department ObjectId", async () => {
    const report = new WeeklyReport({
      department: "not-an-object-id",
      weekStart,
      weekEnd,
    } as unknown as {
      department: Types.ObjectId;
      weekStart: Date;
      weekEnd: Date;
    });

    const validationError = await getValidationError(report);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.department);
  });

  it("defines the expected indexes", () => {
    const indexes = WeeklyReport.schema.indexes();

    assert.ok(
      indexes.some(
        ([fields]) =>
          fields.department === 1 &&
          fields.weekStart === -1
      )
    );

    assert.ok(
      indexes.some(
        ([fields, options]) =>
          fields.department === 1 &&
          fields.weekStart === 1 &&
          fields.weekEnd === 1 &&
          options.unique === true
      )
    );
  });
});