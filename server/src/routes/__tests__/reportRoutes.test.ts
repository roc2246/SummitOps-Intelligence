import assert from "node:assert/strict";
import {
  after,
  before,
  describe,
  it,
} from "node:test";

import express from "express";
import type { Server } from "node:http";

import reportRoutes from "../reportRoutes.js";

describe("reportRoutes", () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/reports", reportRoutes);

    server = app.listen(0);

    await new Promise<void>((resolve) => {
      server.once("listening", resolve);
    });

    const address = server.address();

    if (
      address === null ||
      typeof address === "string"
    ) {
      throw new Error(
        "Could not determine test server port"
      );
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
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

  it("returns 404 for an unknown report route", async () => {
    const response = await fetch(
      `${baseUrl}/api/reports/unknown`
    );

    assert.equal(response.status, 404);
  });
});