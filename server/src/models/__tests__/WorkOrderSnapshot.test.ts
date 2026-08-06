import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Error as MongooseError, Types } from "mongoose";

import WorkOrderSnapshot from "../WorkOrderSnapshot.js";

describe("WorkOrderSnapshot model", () => {
  const validDepartmentId = new Types.ObjectId();
  const validCreatedAtSource = new Date("2026-08-01T12:00:00.000Z");

  it("creates a valid work-order snapshot", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1001",
      source: "maintainx",
      department: validDepartmentId,
      title: "Repair drainage near Lot C",
      category: "Drainage",
      priority: "high",
      status: "in_progress",
      location: "Lot C",
      createdAtSource: validCreatedAtSource,
      dueDateSource: new Date("2026-08-08T12:00:00.000Z"),
      laborHours: 4.5,
    });

    const validationError = snapshot.validateSync();

    assert.equal(validationError, undefined);
    assert.equal(snapshot.externalId, "MX-1001");
    assert.equal(snapshot.source, "maintainx");
    assert.deepEqual(snapshot.department, validDepartmentId);
    assert.equal(snapshot.title, "Repair drainage near Lot C");
    assert.equal(snapshot.category, "Drainage");
    assert.equal(snapshot.priority, "high");
    assert.equal(snapshot.status, "in_progress");
    assert.equal(snapshot.location, "Lot C");
    assert.deepEqual(snapshot.createdAtSource, validCreatedAtSource);
    assert.equal(snapshot.laborHours, 4.5);
  });

  it("applies default values", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1002",
      source: "maintainx",
      department: validDepartmentId,
      title: "Inspect parking lot signs",
      createdAtSource: validCreatedAtSource,
    });

    assert.equal(snapshot.priority, "medium");
    assert.equal(snapshot.status, "open");
    assert.equal(snapshot.laborHours, 0);
    assert.ok(snapshot.snapshotDate instanceof Date);
  });

  it("trims string fields", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "  MX-1003  ",
      source: "csv",
      department: validDepartmentId,
      title: "  Replace damaged sign  ",
      category: "  Signage  ",
      location: "  Main Base  ",
      createdAtSource: validCreatedAtSource,
    });

    assert.equal(snapshot.externalId, "MX-1003");
    assert.equal(snapshot.title, "Replace damaged sign");
    assert.equal(snapshot.category, "Signage");
    assert.equal(snapshot.location, "Main Base");
  });

  it("allows optional fields to be omitted", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MANUAL-1",
      source: "manual",
      department: validDepartmentId,
      title: "Inspect drainage culvert",
      createdAtSource: validCreatedAtSource,
    });

    const validationError = snapshot.validateSync();

    assert.equal(validationError, undefined);
    assert.equal(snapshot.category, undefined);
    assert.equal(snapshot.location, undefined);
    assert.equal(snapshot.dueDateSource, undefined);
    assert.equal(snapshot.completedAtSource, undefined);
  });

  it("rejects a snapshot without an external ID", () => {
    const snapshot = new WorkOrderSnapshot({
      source: "maintainx",
      department: validDepartmentId,
      title: "Missing external ID",
      createdAtSource: validCreatedAtSource,
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.externalId);
    assert.equal(validationError.errors.externalId.kind, "required");
  });

  it("rejects a snapshot without a department", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1004",
      source: "maintainx",
      title: "Missing department",
      createdAtSource: validCreatedAtSource,
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.department);
    assert.equal(validationError.errors.department.kind, "required");
  });

  it("rejects a snapshot without a title", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1005",
      source: "maintainx",
      department: validDepartmentId,
      createdAtSource: validCreatedAtSource,
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.title);
    assert.equal(validationError.errors.title.kind, "required");
  });

  it("rejects a snapshot without a source creation date", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1006",
      source: "maintainx",
      department: validDepartmentId,
      title: "Missing source creation date",
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.createdAtSource);
    assert.equal(
      validationError.errors.createdAtSource.kind,
      "required"
    );
  });

  it("rejects an unsupported source", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1007",
      source: "unsupported",
      department: validDepartmentId,
      title: "Invalid source",
      createdAtSource: validCreatedAtSource,
    } as unknown as {
      externalId: string;
      source: "maintainx";
      department: Types.ObjectId;
      title: string;
      createdAtSource: Date;
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.source);
    assert.equal(validationError.errors.source.kind, "enum");
  });

  it("rejects an unsupported priority", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1008",
      source: "maintainx",
      department: validDepartmentId,
      title: "Invalid priority",
      priority: "urgent",
      createdAtSource: validCreatedAtSource,
    } as unknown as {
      externalId: string;
      source: "maintainx";
      department: Types.ObjectId;
      title: string;
      priority: "high";
      createdAtSource: Date;
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.priority);
    assert.equal(validationError.errors.priority.kind, "enum");
  });

  it("rejects an unsupported status", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1009",
      source: "maintainx",
      department: validDepartmentId,
      title: "Invalid status",
      status: "finished",
      createdAtSource: validCreatedAtSource,
    } as unknown as {
      externalId: string;
      source: "maintainx";
      department: Types.ObjectId;
      title: string;
      status: "completed";
      createdAtSource: Date;
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.status);
    assert.equal(validationError.errors.status.kind, "enum");
  });

  it("rejects negative labor hours", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1010",
      source: "maintainx",
      department: validDepartmentId,
      title: "Invalid labor hours",
      createdAtSource: validCreatedAtSource,
      laborHours: -1,
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.laborHours);
    assert.equal(validationError.errors.laborHours.kind, "min");
  });

  it("rejects an invalid department ObjectId", () => {
    const snapshot = new WorkOrderSnapshot({
      externalId: "MX-1011",
      source: "maintainx",
      department: "not-an-object-id",
      title: "Invalid department",
      createdAtSource: validCreatedAtSource,
    } as unknown as {
      externalId: string;
      source: "maintainx";
      department: Types.ObjectId;
      title: string;
      createdAtSource: Date;
    });

    const validationError = snapshot.validateSync();

    assert.ok(validationError instanceof MongooseError.ValidationError);
    assert.ok(validationError.errors.department);
    assert.equal(validationError.errors.department.kind, "ObjectId");
  });

  it("defines the expected compound indexes", () => {
    const indexes = WorkOrderSnapshot.schema.indexes();

    assert.ok(
      indexes.some(
        ([fields]) =>
          fields.department === 1 &&
          fields.snapshotDate === -1
      )
    );

    assert.ok(
      indexes.some(
        ([fields]) =>
          fields.externalId === 1 &&
          fields.source === 1
      )
    );
  });
});