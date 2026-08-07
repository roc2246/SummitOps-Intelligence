import assert from "node:assert/strict";
import { hashSync } from "bcryptjs";
import type {
  AddressInfo,
} from "node:net";

import {
  after,
  afterEach,
  before,
  describe,
  it,
  mock,
} from "node:test";

import express from "express";

import type {
  Server,
} from "node:http";

import {
  User,
} from "../../models/index.js";

import authRoutes from "../authRoutes.js";

describe("authRoutes", () => {
  let server: Server;
  let baseUrl: string;
  const originalJwtSecret = process.env.JWT_SECRET;

  before(async () => {
    const app = express();

    app.use(express.json());

    app.use(
      "/api/auth",
      authRoutes
    );

    server = app.listen(0);

    await new Promise<void>(
      (resolve) => {
        server.once(
          "listening",
          resolve
        );
      }
    );

    const address =
      server.address() as AddressInfo;

    baseUrl =
      `http://127.0.0.1:${address.port}`;
  });

  afterEach(() => {
    mock.restoreAll();
    process.env.JWT_SECRET = originalJwtSecret;
  });

  after(async () => {
    await new Promise<void>(
      (resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }
    );
  });

  it("handles POST /api/auth/login", async () => {
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

    const response = await fetch(
      `${baseUrl}/api/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email:
            "riley@example.com",
          password:
            "correct-password",
        }),
      }
    );

    const body =
      await response.json();

    assert.equal(
      response.status,
      200
    );

    assert.equal(
      body.success,
      true
    );

    assert.equal(
      typeof body.token,
      "string"
    );

    assert.equal(
      body.user.email,
      "riley@example.com"
    );
  });
});