import assert from "node:assert/strict";
import {
  afterEach,
  describe,
  it,
  mock,
} from "node:test";

import {
  User,
} from "../../models/index.js";

import {
  findActiveUserByEmail,
} from "../authService.js";

describe("findActiveUserByEmail", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it("finds an active user using a normalized email", async () => {
    const fakeUser = {
      username: "riley",
      email: "riley@example.com",
      role: "supervisor",
      isActive: true,
    };

    const findOneMock = mock.method(
      User,
      "findOne",
      async () => fakeUser as never
    );

    const result =
      await findActiveUserByEmail(
        "  RILEY@EXAMPLE.COM  "
      );

    assert.equal(
      result,
      fakeUser
    );

    const firstCall =
      findOneMock.mock.calls[0];

    assert.ok(
      firstCall !== undefined,
      "Expected User.findOne to be called"
    );

    assert.deepEqual(
      firstCall.arguments[0],
      {
        email: "riley@example.com",
        isActive: true,
      }
    );
  });

  it("returns null when no active user exists", async () => {
    mock.method(
      User,
      "findOne",
      async () => null
    );

    const result =
      await findActiveUserByEmail(
        "missing@example.com"
      );

    assert.equal(
      result,
      null
    );
  });
});