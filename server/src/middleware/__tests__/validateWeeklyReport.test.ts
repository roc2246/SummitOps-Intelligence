import assert from "node:assert/strict";
import {
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
  validateWeeklyReport,
} from "../validateWeeklyReport.js";

describe("validateWeeklyReport", () => {
  function createResponseMock() {
    return {
      statusCode: 200,
      jsonBody: undefined as unknown,
      locals: {} as {
        weeklyReportInput?: unknown;
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
  }

  it("calls next for a valid request", () => {
    const request = {
      body: {
        departmentId:
          "6895cd84173241d61e612345",
        weekStart:
          "2026-08-02T00:00:00.000Z",
        weekEnd:
          "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      next.mock.callCount(),
      1
    );

    assert.deepEqual(
      response.locals.weeklyReportInput,
      {
        departmentId:
          "6895cd84173241d61e612345",
        weekStart: new Date(
          "2026-08-02T00:00:00.000Z"
        ),
        weekEnd: new Date(
          "2026-08-08T23:59:59.999Z"
        ),
      }
    );

    assert.equal(
      response.statusCode,
      200
    );
  });

  it("returns 400 for an invalid departmentId", () => {
    const request = {
      body: {
        departmentId: "invalid-id",
        weekStart:
          "2026-08-02T00:00:00.000Z",
        weekEnd:
          "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Invalid departmentId",
      }
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });

  it("returns 400 when departmentId is missing", () => {
    const request = {
      body: {
        weekStart:
          "2026-08-02T00:00:00.000Z",
        weekEnd:
          "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Invalid departmentId",
      }
    );
  });

  it("returns 400 for an invalid weekStart", () => {
    const request = {
      body: {
        departmentId:
          "6895cd84173241d61e612345",
        weekStart: "not-a-date",
        weekEnd:
          "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message:
          "weekStart must be an ISO 8601 UTC timestamp",
      }
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });

  it("returns 400 for an invalid weekEnd", () => {
    const request = {
      body: {
        departmentId:
          "6895cd84173241d61e612345",
        weekStart:
          "2026-08-02T00:00:00.000Z",
        weekEnd: "not-a-date",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message:
          "weekEnd must be an ISO 8601 UTC timestamp",
      }
    );
  });

  it("returns 400 for a non-UTC weekStart string", () => {
    const request = {
      body: {
        departmentId:
          "6895cd84173241d61e612345",
        weekStart: "2026-08-02",
        weekEnd:
          "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message:
          "weekStart must be an ISO 8601 UTC timestamp",
      }
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });

  it("returns 400 when weekStart is after weekEnd", () => {
    const request = {
      body: {
        departmentId:
          "6895cd84173241d61e612345",
        weekStart:
          "2026-08-09T00:00:00.000Z",
        weekEnd:
          "2026-08-08T23:59:59.999Z",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    validateWeeklyReport(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message:
          "weekStart must be before weekEnd",
      }
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });
});