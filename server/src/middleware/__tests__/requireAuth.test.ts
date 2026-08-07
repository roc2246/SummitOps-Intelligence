import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
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
  requireAuth,
} from "../requireAuth.js";

import type {
  AuthenticatedRequest,
} from "../requireAuth.js";

describe("requireAuth", () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  afterEach(() => {
    mock.restoreAll();
    process.env.JWT_SECRET = originalJwtSecret;
  });

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

  it("returns 401 when authorization header is missing", () => {
    const request = {
      header: () => undefined,
    } as unknown as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    requireAuth(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      401
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });

  it("returns 401 for invalid bearer token", () => {
    process.env.JWT_SECRET = "test-secret";

    const request = {
      header: (name: string) =>
        name.toLowerCase() === "authorization"
          ? "Bearer invalid-token"
          : undefined,
    } as unknown as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    requireAuth(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      401
    );

    assert.equal(
      next.mock.callCount(),
      0
    );
  });

  it("stores user id and role from valid token and calls next", () => {
    process.env.JWT_SECRET = "test-secret";

    const userId = "6895cd84173241d61e612345";

    const token = jwt.sign(
      {
        sub: userId,
        role: "manager",
      },
      process.env.JWT_SECRET
    );

    const request = {
      header: (name: string) =>
        name.toLowerCase() === "authorization"
          ? `Bearer ${token}`
          : undefined,
    } as unknown as AuthenticatedRequest;

    const response =
      createResponseMock();

    const next = mock.fn();

    requireAuth(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      request.authUserId,
      userId
    );

    assert.equal(
      request.authUserRole,
      "manager"
    );

    assert.equal(
      next.mock.callCount(),
      1
    );
  });
});