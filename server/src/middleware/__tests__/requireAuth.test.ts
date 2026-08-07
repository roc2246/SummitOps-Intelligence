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
  requireAuth,
} from "../requireAuth.js";

import type {
  AuthenticatedRequest,
} from "../requireAuth.js";

describe("requireAuth", () => {
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

  it("returns 401 when x-user-id is missing", () => {
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

  it("returns 401 when x-user-id is invalid", () => {
    const request = {
      header: () => "invalid-id",
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

  it("stores the user id and calls next", () => {
    const userId =
      "6895cd84173241d61e612345";

    const request = {
      header: () => userId,
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
      next.mock.callCount(),
      1
    );
  });
});