import assert from "assert";
import { describe, it } from "node:test";
import { Error as MongooseError } from "mongoose";

import Department from "../Department.js";

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

describe("Department model", () => {
  it("creates a valid department document", async () => {
    const department = new Department({
      name: "Grounds",
      description: "Maintains outdoor resort areas",
      isActive: true,
    });

    const validationError = await getValidationError(department);

    assert.equal(validationError, undefined);
    assert.equal(department.name, "Grounds");
    assert.equal(department.description, "Maintains outdoor resort areas");
    assert.equal(department.isActive, true);
  });

  it("defaults isActive to true", () => {
    const department = new Department({
      name: "Mountain Operations",
    });
    assert.equal(department.isActive, true);
  });
  it("trims whitespace from the name and description", () => {
    const department = new Department({
      name: "  Grounds  ",
      description: "  Maintains resort grounds  ",
    });

    assert.equal(department.name, "Grounds");
    assert.equal(department.description, "Maintains resort grounds");
  });

  it("allows description to be omitted", async () => {
    const department = new Department({
      name: "Facilities",
    });

    const validationError = await getValidationError(department);

    assert.equal(validationError, undefined);
    assert.equal(department.description, undefined);
  });

  it("rejects a department without a name", async () => {
    const department = new Department({
      description: "Missing a department name",
    });

    const validationError = await getValidationError(department);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.name);
    assert.equal(validationError.errors.name.kind, "required");
  });

  it("rejects a non-boolean isActive value", async () => {
    const department = new Department({
      name: "Events",
      isActive: "not-a-boolean",
    });

    const validationError = await getValidationError(department);

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.isActive);
    assert.equal(validationError.errors.isActive.kind, "Boolean");
  });
});
