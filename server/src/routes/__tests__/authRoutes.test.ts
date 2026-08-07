import assert from "node:assert/strict";
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
      body.user.email,
      "riley@example.com"
    );
  });
});