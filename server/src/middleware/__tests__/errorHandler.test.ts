import assert from "node:assert/strict";
import {
  describe,
  it,
} from "node:test";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  errorHandler,
} from "../errorHandler.js";
import { AppError } from "../../utils/AppError.js";

describe("errorHandler", () => {
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

  it("returns status 500 with an internal server error response", () => {
    const error =
      new Error("Database failed");

    const request = {} as Request;

    const response =
      createResponseMock();

    const next =
      (() => {}) as NextFunction;

    errorHandler(
      error,
      request,
      response as unknown as Response,
      next
    );

    assert.equal(
      response.statusCode,
      500
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Internal server error",
      }
    );
  });

  it("returns the app error status and message", () => {
    const error = new AppError(
      404,
      "Department not found"
    );

    const request = {} as Request;
    const response = createResponseMock();
    const next = (() => {}) as NextFunction;

    errorHandler(
      error,
      request,
      response as unknown as Response,
      next
    );

    assert.equal(response.statusCode, 404);

    assert.deepEqual(response.jsonBody, {
      success: false,
      message: "Department not found",
    });
  });

  it("returns 409 for duplicate key conflicts", () => {
    const error = {
      code: 11000,
    };

    const request = {} as Request;
    const response = createResponseMock();
    const next = (() => {}) as NextFunction;

    errorHandler(
      error as unknown as Error,
      request,
      response as unknown as Response,
      next
    );

    assert.equal(response.statusCode, 409);

    assert.deepEqual(response.jsonBody, {
      success: false,
      message: "A report already exists for that department and week.",
    });
  });
});