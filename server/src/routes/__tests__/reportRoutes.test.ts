import assert from "node:assert/strict";
import {
  after,
  afterEach,
  before,
  describe,
  it,
  mock,
} from "node:test";

import express from "express";
import type { Server } from "node:http";
import { Types } from "mongoose";

import { errorHandler } from "../../middleware/errorHandler.js";
import {
  Department,
  WeeklyReport,
  WorkOrderSnapshot,
} from "../../models/index.js";
import reportRoutes from "../reportRoutes.js";

describe("reportRoutes", () => {
  let server: Server;
  let baseUrl: string;

  afterEach(() => {
    mock.restoreAll();
  });

  before(async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/reports", reportRoutes);
    app.use(errorHandler);

    server = app.listen(0);

    await new Promise<void>((resolve) => {
      server.once("listening", resolve);
    });

    const address = server.address();

    if (
      address === null ||
      typeof address === "string"
    ) {
      throw new Error(
        "Could not determine test server port"
      );
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise<void>(
      (resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }
    );
  });

  it("returns 404 for an unknown report route", async () => {
    const response = await fetch(
      `${baseUrl}/api/reports/unknown`
    );

    assert.equal(response.status, 404);
  });

  it("creates a weekly report for a valid request", async () => {
    const departmentId = new Types.ObjectId();

    mock.method(
      Department,
      "exists",
      async () => ({ _id: departmentId }) as never
    );

    mock.method(
      WorkOrderSnapshot,
      "find",
      async () => []
    );

    mock.method(
      WeeklyReport,
      "create",
      async () => ({
        department: departmentId.toString(),
        weekStart: "2026-08-02T00:00:00.000Z",
        weekEnd: "2026-08-08T23:59:59.999Z",
        status: "draft",
        metrics: {
          openedWorkOrders: 0,
          completedWorkOrders: 0,
          overdueWorkOrders: 0,
          openBacklog: 0,
          completionRate: 0,
          totalLaborHours: 0,
        },
      }) as never
    );

    const response = await fetch(
      `${baseUrl}/api/reports/weekly`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: departmentId.toString(),
          weekStart: "2026-08-02T00:00:00.000Z",
          weekEnd: "2026-08-08T23:59:59.999Z",
        }),
      }
    );

    assert.equal(response.status, 201);

    const body = await response.json();

    assert.deepEqual(body, {
      department: departmentId.toString(),
      weekStart: "2026-08-02T00:00:00.000Z",
      weekEnd: "2026-08-08T23:59:59.999Z",
      status: "draft",
      metrics: {
        openedWorkOrders: 0,
        completedWorkOrders: 0,
        overdueWorkOrders: 0,
        openBacklog: 0,
        completionRate: 0,
        totalLaborHours: 0,
      },
    });
  });

  it("rejects non-UTC weekly report dates", async () => {
    const response = await fetch(
      `${baseUrl}/api/reports/weekly`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: "6895cd84173241d61e612345",
          weekStart: "2026-08-02",
          weekEnd: "2026-08-08T23:59:59.999Z",
        }),
      }
    );

    assert.equal(response.status, 400);

    const body = await response.json();

    assert.deepEqual(body, {
      success: false,
      message: "weekStart must be an ISO 8601 UTC timestamp",
    });
  });

  it("returns 404 when the department does not exist", async () => {
    mock.method(
      Department,
      "exists",
      async () => null
    );

    const response = await fetch(
      `${baseUrl}/api/reports/weekly`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: "6895cd84173241d61e612345",
          weekStart: "2026-08-02T00:00:00.000Z",
          weekEnd: "2026-08-08T23:59:59.999Z",
        }),
      }
    );

    assert.equal(response.status, 404);

    const body = await response.json();

    assert.deepEqual(body, {
      success: false,
      message: "Department not found",
    });
  });

  it("returns 409 when a report already exists for the week", async () => {
    const departmentId = new Types.ObjectId();

    mock.method(
      Department,
      "exists",
      async () => ({ _id: departmentId }) as never
    );

    mock.method(
      WorkOrderSnapshot,
      "find",
      async () => []
    );

    mock.method(
      WeeklyReport,
      "create",
      async () => {
        throw {
          code: 11000,
        };
      }
    );

    const response = await fetch(
      `${baseUrl}/api/reports/weekly`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: departmentId.toString(),
          weekStart: "2026-08-02T00:00:00.000Z",
          weekEnd: "2026-08-08T23:59:59.999Z",
        }),
      }
    );

    assert.equal(response.status, 409);

    const body = await response.json();

    assert.deepEqual(body, {
      success: false,
      message: "A report already exists for that department and week.",
    });
  });
});