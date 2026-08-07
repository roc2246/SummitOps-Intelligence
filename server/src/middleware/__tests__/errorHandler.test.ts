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
});