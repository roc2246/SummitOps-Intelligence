import assert from "node:assert/strict";
import {
  describe,
  it,
} from "node:test";

import type {
  Request,
  Response,
} from "express";

import {
  notFoundHandler,
} from "../notFoundHandler.js";

describe("notFoundHandler", () => {
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

  it("returns status 404 with a route not found response", () => {
    const request = {} as Request;

    const response =
      createResponseMock();

    notFoundHandler(
      request,
      response as unknown as Response,
      (() => {}) as never
    );

    assert.equal(
      response.statusCode,
      404
    );

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Route not found",
      }
    );
  });
});