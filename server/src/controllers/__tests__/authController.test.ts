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
  User,
} from "../../models/index.js";

import {
  loginPlaceholder,
} from "../authController.js";

describe("loginPlaceholder", () => {
  afterEach(() => {
    mock.restoreAll();
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

  it("returns 400 when email is missing", async () => {
    const request = {
      body: {},
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    await loginPlaceholder(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      400
    );
  });

  it("returns 401 when user is not found", async () => {
    mock.method(
      User,
      "findOne",
      async () => null
    );

    const request = {
      body: {
        email: "missing@example.com",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    await loginPlaceholder(
      request,
      response as unknown as Response,
      next as unknown as NextFunction
    );

    assert.equal(
      response.statusCode,
      401
    );
  });

  it("returns the active user", async () => {
    const fakeUser = {
      _id: "6895cd84173241d61e612345",
      username: "riley",
      email: "riley@example.com",
      role: "supervisor",
      isActive: true,
    };

    mock.method(
      User,
      "findOne",
      async () => fakeUser as never
    );

    const request = {
      body: {
        email: "riley@example.com",
      },
    } as Request;

    const response =
      createResponseMock();

    const next = mock.fn();

    await loginPlaceholder(
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
        success: true,

        user: {
          id: fakeUser._id,
          username: "riley",
          email: "riley@example.com",
          role: "supervisor",
        },
      }
    );
  });
});