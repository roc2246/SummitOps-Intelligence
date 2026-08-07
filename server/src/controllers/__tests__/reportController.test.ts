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
  Department,
  WeeklyReport,
  WorkOrderSnapshot,
} from "../../models/index.js";

import {
  createWeeklyReport,
  listWeeklyReports,
} from "../reportController.js";

function createResponseMock() {
  const response = {
    statusCode: 200,
    jsonBody: undefined as unknown,
    locals: {
      weeklyReportInput: {
        departmentId: "6895cd84173241d61e612345",
        weekStart: new Date("2026-08-02T00:00:00.000Z"),
        weekEnd: new Date("2026-08-08T23:59:59.999Z"),
      },
    },

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

describe("createWeeklyReport", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("creates a weekly report and returns status 201", async () => {
    const request = {
      body: {},
    } as Request;

    const response = createResponseMock();
    const validatedInput = response.locals.weeklyReportInput;

    const createdReport = {
      department: validatedInput.departmentId,
      weekStart: validatedInput.weekStart,
      weekEnd: validatedInput.weekEnd,
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
      Department,
      "exists",
      async () => ({ _id: validatedInput.departmentId }) as never
    );

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
      body: {},
    } as Request;

    const response = createResponseMock();
    const validatedInput = response.locals.weeklyReportInput;

    const expectedError = new Error(
      "Database unavailable"
    );

    mock.method(
      Department,
      "exists",
      async () => ({ _id: validatedInput.departmentId }) as never
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

    const firstCall = next.mock.calls[0];
    assert.ok(firstCall !== undefined);

    assert.equal(
      firstCall.arguments[0],
      expectedError
    );
  });
});

describe("listWeeklyReports", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("returns weekly reports", async () => {
    const reports = [
      {
        _id: "report-1",
        status: "draft",
      },
    ];

    mock.method(
      WeeklyReport,
      "countDocuments",
      async () => 1
    );

    const leanMock = mock.fn(
      async () => reports
    );

    const limitMock = mock.fn(
      () => ({
        lean: leanMock,
      })
    );

    const skipMock = mock.fn(
      () => ({
        limit: limitMock,
      })
    );

    const sortMock = mock.fn(
      () => ({
        skip: skipMock,
      })
    );

    mock.method(
      WeeklyReport,
      "find",
      () =>
        ({
          sort: sortMock,
        }) as never
    );

    const request = {
      query: {
        page: "2",
        limit: "10",
      },
    } as unknown as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    await listWeeklyReports(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      200
    );

    assert.deepEqual(
      response.jsonBody,
      {
        data: reports,
        pagination: {
          page: 2,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      }
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });

  it("returns 400 for invalid departmentId filter", async () => {
    const request = {
      query: {
        departmentId: "invalid-object-id",
      },
    } as unknown as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    await listWeeklyReports(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(response.statusCode, 400);

    assert.deepEqual(response.jsonBody, {
      success: false,
      message: "Invalid departmentId",
    });

    assert.equal(next.mock.callCount(), 0);
  });
});