import assert from "node:assert/strict";
import {
  afterEach,
  describe,
  it,
  mock,
} from "node:test";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  WeeklyReport,
  WorkOrderSnapshot,
} from "../../models/index.js";

import {
  createWeeklyReport,
} from "../reportController.js";

describe("createWeeklyReport", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  function createResponseMock() {
    const response = {
      statusCode: 200,
      jsonBody: undefined as unknown,

      status(code: number) {
        this.statusCode = code;
        return this;
      },

      json(body: unknown) {
        this.jsonBody = body;
        return this;
      },
    };

    return response;
  }

  it("creates a weekly report and returns status 201", async () => {
    const request = {
      body: {
        departmentId: "6895cd84173241d61e612345",
        weekStart: "2026-08-02T00:00:00.000Z",
        weekEnd: "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response = createResponseMock();

    const createdReport = {
      department: request.body.departmentId,
      weekStart: new Date(request.body.weekStart),
      weekEnd: new Date(request.body.weekEnd),
      status: "draft",
      metrics: {
        openedWorkOrders: 0,
        completedWorkOrders: 0,
        overdueWorkOrders: 0,
        openBacklog: 0,
        completionRate: 0,
        totalLaborHours: 0,
      },
    };

    mock.method(
      WorkOrderSnapshot,
      "find",
      async () => []
    );

    mock.method(
      WeeklyReport,
      "create",
      async () => createdReport as never
    );

    const next = mock.fn();

    await createWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(response.statusCode, 201);

    assert.deepEqual(
      response.jsonBody,
      createdReport
    );

    assert.equal(next.mock.callCount(), 0);
  });

  it("passes service errors to the error middleware", async () => {
    const request = {
      body: {
        departmentId: "6895cd84173241d61e612345",
        weekStart: "2026-08-02T00:00:00.000Z",
        weekEnd: "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response = createResponseMock();

    const expectedError = new Error(
      "Database unavailable"
    );

    mock.method(
      WorkOrderSnapshot,
      "find",
      async () => {
        throw expectedError;
      }
    );

    const next = mock.fn();

    await createWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(next.mock.callCount(), 1);

    assert.equal(
      next.mock.calls[0].arguments[0],
      expectedError
    );
  });
});