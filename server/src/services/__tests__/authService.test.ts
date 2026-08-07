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
  findActiveUserByEmailWithPasswordHash,
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

  it("selects passwordHash in credential lookup", async () => {
    const fakeUser = {
      username: "riley",
      email: "riley@example.com",
      role: "supervisor",
      isActive: true,
      passwordHash: "hashed-password",
    };

    const selectMock = mock.fn(
      async (_projection: string) => fakeUser
    );

    const findOneMock = mock.method(
      User,
      "findOne",
      () =>
        ({
          select: selectMock,
        }) as never
    );

    const result =
      await findActiveUserByEmailWithPasswordHash(
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

    assert.equal(
      selectMock.mock.callCount(),
      1
    );

    const selectFirstCall =
      selectMock.mock.calls[0];

    assert.ok(
      selectFirstCall !== undefined,
      "Expected select to be called"
    );

    assert.equal(
      selectFirstCall.arguments[0],
      "+passwordHash"
    );
  });
});