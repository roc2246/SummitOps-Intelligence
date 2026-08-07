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
} from "../reportController.js";

describe("createWeeklyReport", () => {
  afterEach(() => {
    mock.restoreAll();
  });

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
  it("returns weekly reports", async () => {
  const reports = [
    {
      _id: "report-1",
      status: "draft",
    },
  ];

  const sortMock = mock.fn(
    async () => reports
  );

  mock.method(
    WeeklyReport,
    "find",
    () =>
      ({
        sort: sortMock,
      }) as never
  );

  const request = {} as Request;
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
    reports
  );

  assert.equal(
    next.mock.callCount(),
    0
  );
  });
});