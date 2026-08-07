import assert from "node:assert/strict";
import {
  describe,
  it,
  mock,
} from "node:test";

import type {
  NextFunction,
  Response,
} from "express";

import {
  requireRole,
} from "../requireRole.js";

describe("requireRole", () => {
  function createResponseMock() {
    return {
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
  }

  it("returns 403 when user role is missing", () => {
    const middleware = requireRole("manager");

    const request = {};
    const response = createResponseMock();
    const next = mock.fn();

    middleware(
      request as never,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(response.statusCode, 403);
    assert.deepEqual(response.jsonBody, {
      success: false,
      message: "Forbidden",
    });

    assert.equal(next.mock.callCount(), 0);
  });

  it("returns 403 when user role is not allowed", () => {
    const middleware = requireRole("manager", "admin");

    const request = {
      authUserRole: "supervisor",
    };

    const response = createResponseMock();
    const next = mock.fn();

    middleware(
      request as never,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(response.statusCode, 403);
    assert.equal(next.mock.callCount(), 0);
  });

  it("calls next when user role is allowed", () => {
    const middleware = requireRole("manager", "admin");

    const request = {
      authUserRole: "admin",
    };

    const response = createResponseMock();
    const next = mock.fn();

    middleware(
      request as never,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(response.statusCode, 200);
    assert.equal(next.mock.callCount(), 1);
  });
});