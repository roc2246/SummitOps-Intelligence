import assert from "node:assert/strict";
import { hashSync } from "bcryptjs";
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

  it("returns 400 when email or password is missing", async () => {
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

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Email and password are required",
      }
    );
  });

  it("returns 401 when user is not found", async () => {
    mock.method(
      User,
      "findOne",
      () =>
        ({
          select: async () => null,
        }) as never
    );

    const request = {
      body: {
        email: "missing@example.com",
        password: "some-password",
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

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Invalid credentials",
      }
    );
  });

  it("returns 401 when password does not match", async () => {
    const fakeUser = {
      _id: "6895cd84173241d61e612345",
      username: "riley",
      email: "riley@example.com",
      role: "supervisor",
      isActive: true,
      passwordHash: hashSync("correct-password", 8),
    };

    mock.method(
      User,
      "findOne",
      () =>
        ({
          select: async () => fakeUser,
        }) as never
    );

    const request = {
      body: {
        email: "riley@example.com",
        password: "wrong-password",
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

    assert.deepEqual(
      response.jsonBody,
      {
        success: false,
        message: "Invalid credentials",
      }
    );
  });

  it("returns token and user data for valid credentials", async () => {
    process.env.JWT_SECRET = "test-secret";

    const fakeUser = {
      _id: "6895cd84173241d61e612345",
      username: "riley",
      email: "riley@example.com",
      role: "supervisor",
      isActive: true,
      passwordHash: hashSync("correct-password", 8),
    };

    mock.method(
      User,
      "findOne",
      () =>
        ({
          select: async () => fakeUser,
        }) as never
    );

    const request = {
      body: {
        email: "riley@example.com",
        password: "correct-password",
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

    assert.equal(next.mock.callCount(), 0);

    const body = response.jsonBody as {
      success: boolean;
      token?: string;
      user?: {
        id: string;
        username: string;
        email: string;
        role: string;
      };
    };

    assert.equal(body.success, true);
    assert.equal(typeof body.token, "string");
    assert.ok(body.token);

    assert.deepEqual(
      body.user,
      {
        id: fakeUser._id,
        username: "riley",
        email: "riley@example.com",
        role: "supervisor",
      }
    );
  });
});