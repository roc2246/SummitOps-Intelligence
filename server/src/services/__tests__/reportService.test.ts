import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { Types } from "mongoose";

import {
  WeeklyReport,
  WorkOrderSnapshot,
} from "../../models/index.js";

import { generateWeeklyReport } from "../reportService.js";

import type {
  IWorkOrderSnapshot,
} from "../../models/index.js";

describe("generateWeeklyReport", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("finds work orders for the department and reporting period", async () => {
    const departmentId = new Types.ObjectId();

    const weekStart = new Date("2026-08-02T00:00:00.000Z");
    const weekEnd = new Date("2026-08-08T23:59:59.999Z");

    const workOrders: IWorkOrderSnapshot[] = [];

    const findMock = mock.method(
      WorkOrderSnapshot,
      "find",
      async () => workOrders
    );

    mock.method(
      WeeklyReport,
      "create",
      async (data: unknown) => data as never
    );

    await generateWeeklyReport(
      departmentId.toString(),
      weekStart,
      weekEnd
    );

    assert.equal(findMock.mock.callCount(), 1);

    const call = findMock.mock.calls[0];
    assert.ok(call !== undefined, "Expected WorkOrderSnapshot.find to be called");
    if (!call) {
      throw new Error("Expected WorkOrderSnapshot.find to be called");
    }

    assert.deepEqual(call.arguments[0], {
      department: departmentId.toString(),
      createdAtSource: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    });
  });

  it("creates a weekly report with calculated metrics", async () => {
    const departmentId = new Types.ObjectId();

    const weekStart = new Date("2026-08-02T00:00:00.000Z");
    const weekEnd = new Date("2026-08-08T23:59:59.999Z");

    const workOrders: IWorkOrderSnapshot[] = [
      {
        externalId: "MX-1000",
        source: "maintainx",
        department: departmentId,
        title: "Repair trail sign",
        priority: "medium",
        status: "completed",
        createdAtSource: new Date("2026-08-03T12:00:00.000Z"),
        laborHours: 2,
        snapshotDate: new Date("2026-08-07T12:00:00.000Z"),
      },

      {
        externalId: "MX-1001",
        source: "maintainx",
        department: departmentId,
        title: "Repair drainage",
        priority: "high",
        status: "open",
        createdAtSource: new Date("2026-08-04T12:00:00.000Z"),
        laborHours: 4,
        snapshotDate: new Date("2026-08-07T12:00:00.000Z"),
      },
    ];

    mock.method(
      WorkOrderSnapshot,
      "find",
      async () => workOrders
    );

    const createMock = mock.method(
      WeeklyReport,
      "create",
      async (data: unknown) => data as never
    );

    await generateWeeklyReport(
      departmentId.toString(),
      weekStart,
      weekEnd
    );

    assert.equal(createMock.mock.callCount(), 1);

    const call = createMock.mock.calls[0];
    assert.ok(call !== undefined, "Expected WeeklyReport.create to be called");
    if (!call) {
      throw new Error("Expected WeeklyReport.create to be called");
    }

    assert.deepEqual(call.arguments[0], {
      department: departmentId.toString(),
      weekStart,
      weekEnd,
      metrics: {
        openedWorkOrders: 2,
        completedWorkOrders: 1,
        overdueWorkOrders: 0,
        openBacklog: 1,
        completionRate: 50,
        totalLaborHours: 6,
      },
    });
  });

  it("returns the created weekly report", async () => {
    const departmentId = new Types.ObjectId();

    const weekStart = new Date("2026-08-02T00:00:00.000Z");
    const weekEnd = new Date("2026-08-08T23:59:59.999Z");

    mock.method(
      WorkOrderSnapshot,
      "find",
      async () => []
    );

    const createdReport = {
      department: departmentId,
      weekStart,
      weekEnd,
      status: "draft",
    };

    mock.method(
      WeeklyReport,
      "create",
      async () => createdReport as never
    );

    const result = await generateWeeklyReport(
      departmentId.toString(),
      weekStart,
      weekEnd
    );

    assert.equal(result, createdReport);
  });
});