import assert from "node:assert/strict";
import {
  describe,
  it,
} from "node:test";
import { Error as MongooseError } from "mongoose";

import User from "../User.js";

async function getValidationError(document: {
  validate: () => Promise<void>;
}): Promise<MongooseError.ValidationError | undefined> {
  try {
    await document.validate();
    return undefined;
  } catch (error) {
    return error as MongooseError.ValidationError;
  }
}

describe("User model", () => {
  it("creates a valid user", async () => {
    const user = new User({
      username: "riley",
      email: "riley@example.com",
      passwordHash: "hashed-password",
      role: "supervisor",
      isActive: true,
    });

    const error = await getValidationError(user);

    assert.equal(error, undefined);
  });

  it("defaults role to supervisor", () => {
    const user = new User({
      username: "riley",
      email: "riley@example.com",
      passwordHash: "hashed-password",
    });

    assert.equal(
      user.role,
      "supervisor"
    );
  });

  it("defaults isActive to true", () => {
    const user = new User({
      username: "riley",
      email: "riley@example.com",
      passwordHash: "hashed-password",
    });

    assert.equal(
      user.isActive,
      true
    );
  });

  it("trims username", () => {
    const user = new User({
      username: "  riley  ",
      email: "riley@example.com",
      passwordHash: "hashed-password",
    });

    assert.equal(
      user.username,
      "riley"
    );
  });

  it("trims and lowercases email", () => {
    const user = new User({
      username: "riley",
      email: "  RILEY@EXAMPLE.COM  ",
      passwordHash: "hashed-password",
    });

    assert.equal(
      user.email,
      "riley@example.com"
    );
  });

  it("rejects missing username", async () => {
    const user = new User({
      email: "riley@example.com",
      passwordHash: "hashed-password",
    });

    const error = await getValidationError(user);

    assert.ok(
      error?.errors.username
    );

    assert.equal(
      error.errors.username.kind,
      "required"
    );
  });

  it("rejects missing email", async () => {
    const user = new User({
      username: "riley",
      passwordHash: "hashed-password",
    });

    const error = await getValidationError(user);

    assert.ok(
      error?.errors.email
    );

    assert.equal(
      error.errors.email.kind,
      "required"
    );
  });

  it("rejects missing passwordHash", async () => {
    const user = new User({
      username: "riley",
      email: "riley@example.com",
    });

    const error = await getValidationError(user);

    assert.ok(
      error?.errors.passwordHash
    );

    assert.equal(
      error.errors.passwordHash.kind,
      "required"
    );
  });

  it("rejects an invalid role", async () => {
    const user = new User({
      username: "riley",
      email: "riley@example.com",
      passwordHash: "hashed-password",
      role: "employee" as never,
    });

    const error = await getValidationError(user);

    assert.ok(
      error?.errors.role
    );

    assert.equal(
      error.errors.role.kind,
      "enum"
    );
  });

  it("defines unique indexes for username and email", () => {
    const indexes = User.schema.indexes();

    const usernameIndex = indexes.find(
      ([fields]) =>
        fields.username === 1
    );

    const emailIndex = indexes.find(
      ([fields]) =>
        fields.email === 1
    );

    assert.ok(usernameIndex);
    assert.ok(emailIndex);

    assert.equal(
      usernameIndex[1].unique,
      true
    );

    assert.equal(
      emailIndex[1].unique,
      true
    );
  });
});