import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Types } from "mongoose";

import { calculateWeeklyMetrics } from "../analyticsService.js";

import type { IWorkOrderSnapshot } from "../../models/index.js";

describe("calculateWeeklyMetrics", () => {
  const departmentId = new Types.ObjectId();
  const reportCutoff = new Date("2026-08-08T23:59:59.999Z");

  function createWorkOrder(
    overrides: Partial<IWorkOrderSnapshot> = {}
  ): IWorkOrderSnapshot {
    return {
      externalId: "MX-1000",
      source: "maintainx",
      department: departmentId,
      title: "Test work order",
      priority: "medium",
      status: "open",
      createdAtSource: new Date("2026-08-01T12:00:00.000Z"),
      laborHours: 0,
      snapshotDate: new Date("2026-08-07T12:00:00.000Z"),
      ...overrides,
    };
  }

  it("returns zero metrics for an empty work-order array", () => {
    const metrics = calculateWeeklyMetrics([], reportCutoff);

    assert.deepEqual(metrics, {
      openedWorkOrders: 0,
      completedWorkOrders: 0,
      overdueWorkOrders: 0,
      openBacklog: 0,
      completionRate: 0,
      totalLaborHours: 0,
    });
  });

  it("counts all supplied work orders as opened work orders", () => {
    const workOrders = [
      createWorkOrder(),
      createWorkOrder({
        externalId: "MX-1001",
      }),
      createWorkOrder({
        externalId: "MX-1002",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.openedWorkOrders, 3);
  });

  it("counts completed work orders", () => {
    const workOrders = [
      createWorkOrder({
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1001",
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1002",
        status: "open",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.completedWorkOrders, 2);
  });

  it("counts open backlog and excludes completed and cancelled work", () => {
    const workOrders = [
      createWorkOrder({
        status: "open",
      }),

      createWorkOrder({
        externalId: "MX-1001",
        status: "in_progress",
      }),

      createWorkOrder({
        externalId: "MX-1002",
        status: "on_hold",
      }),

      createWorkOrder({
        externalId: "MX-1003",
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1004",
        status: "cancelled",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.openBacklog, 3);
  });

  it("counts overdue work orders", () => {
    const pastDueDate = new Date("2026-08-01T00:00:00.000Z");
    const futureDueDate = new Date("2026-08-15T00:00:00.000Z");

    const workOrders = [
      createWorkOrder({
        dueDateSource: pastDueDate,
        status: "open",
      }),

      createWorkOrder({
        externalId: "MX-1001",
        dueDateSource: pastDueDate,
        status: "in_progress",
      }),

      createWorkOrder({
        externalId: "MX-1002",
        dueDateSource: futureDueDate,
        status: "open",
      }),

      createWorkOrder({
        externalId: "MX-1003",
        dueDateSource: pastDueDate,
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1004",
        dueDateSource: pastDueDate,
        status: "cancelled",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.overdueWorkOrders, 2);
  });

  it("does not count work orders without a due date as overdue", () => {
    const workOrders = [
      createWorkOrder({
        status: "open",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.overdueWorkOrders, 0);
  });

  it("adds total labor hours", () => {
    const workOrders = [
      createWorkOrder({
        laborHours: 2,
      }),

      createWorkOrder({
        externalId: "MX-1001",
        laborHours: 3.5,
      }),

      createWorkOrder({
        externalId: "MX-1002",
        laborHours: 1,
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.totalLaborHours, 6.5);
  });

  it("calculates completion rate", () => {
    const workOrders = [
      createWorkOrder({
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1001",
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1002",
        status: "open",
      }),

      createWorkOrder({
        externalId: "MX-1003",
        status: "open",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.completionRate, 50);
  });

  it("rounds completion rate to the nearest whole number", () => {
    const workOrders = [
      createWorkOrder({
        status: "completed",
      }),

      createWorkOrder({
        externalId: "MX-1001",
        status: "open",
      }),

      createWorkOrder({
        externalId: "MX-1002",
        status: "open",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.equal(metrics.completionRate, 33);
  });

  it("calculates all metrics together correctly", () => {
    const pastDueDate = new Date("2026-08-01T00:00:00.000Z");

    const workOrders = [
      createWorkOrder({
        externalId: "MX-1",
        status: "completed",
        laborHours: 4,
      }),

      createWorkOrder({
        externalId: "MX-2",
        status: "open",
        dueDateSource: pastDueDate,
        laborHours: 2,
      }),

      createWorkOrder({
        externalId: "MX-3",
        status: "in_progress",
        dueDateSource: pastDueDate,
        laborHours: 3.5,
      }),

      createWorkOrder({
        externalId: "MX-4",
        status: "cancelled",
        laborHours: 1,
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.deepEqual(metrics, {
      openedWorkOrders: 4,
      completedWorkOrders: 1,
      overdueWorkOrders: 2,
      openBacklog: 2,
      completionRate: 25,
      totalLaborHours: 10.5,
    });
  });

  it("does not use the current system time for overdue counts", () => {
    const workOrders = [
      createWorkOrder({
        dueDateSource: new Date("2099-01-01T00:00:00.000Z"),
        status: "open",
      }),
    ];

    const metrics = calculateWeeklyMetrics(
      workOrders,
      reportCutoff
    );

    assert.deepEqual(metrics, {
      openedWorkOrders: 1,
      completedWorkOrders: 0,
      overdueWorkOrders: 0,
      openBacklog: 1,
      completionRate: 0,
      totalLaborHours: 0,
    });
  });
});