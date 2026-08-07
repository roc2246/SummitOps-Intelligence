import assert from "node:assert/strict";
import test from "node:test";

import {
  getMaintainXConfig,
  getWorkdayConfig,
} from "../integrationConfig.js";

test(
  "getMaintainXConfig uses the default MaintainX API URL",
  () => {
    const originalUrl =
      process.env.MAINTAINX_API_URL;

    delete process.env
      .MAINTAINX_API_URL;

    try {
      const config =
        getMaintainXConfig();

      assert.equal(
        config.baseUrl,
        "https://api.getmaintainx.com/v1"
      );

      assert.equal(
        config.endpoints.workOrders,
        "/workorders"
      );

      assert.equal(
        config.endpoints.workRequests,
        "/workrequests"
      );

      assert.equal(
        config.endpoints.assets,
        "/assets"
      );
    } finally {
      if (originalUrl !== undefined) {
        process.env.MAINTAINX_API_URL =
          originalUrl;
      }
    }
  }
);

test(
  "getMaintainXConfig uses environment configuration",
  () => {
    const originalApiKey =
      process.env.MAINTAINX_API_KEY;

    const originalUrl =
      process.env.MAINTAINX_API_URL;

    process.env.MAINTAINX_API_KEY =
      "test-api-key";

    process.env.MAINTAINX_API_URL =
      "https://example.com/v1";

    try {
      const config =
        getMaintainXConfig();

      assert.equal(
        config.apiKey,
        "test-api-key"
      );

      assert.equal(
        config.baseUrl,
        "https://example.com/v1"
      );
    } finally {
      if (
        originalApiKey === undefined
      ) {
        delete process.env
          .MAINTAINX_API_KEY;
      } else {
        process.env.MAINTAINX_API_KEY =
          originalApiKey;
      }

      if (
        originalUrl === undefined
      ) {
        delete process.env
          .MAINTAINX_API_URL;
      } else {
        process.env.MAINTAINX_API_URL =
          originalUrl;
      }
    }
  }
);

test(
  "getWorkdayConfig reads Workday configuration from environment variables",
  () => {
    const originalValues = {
      clientId:
        process.env.WORKDAY_CLIENT_ID,
      clientSecret:
        process.env
          .WORKDAY_CLIENT_SECRET,
      tenant:
        process.env.WORKDAY_TENANT,
      apiUrl:
        process.env.WORKDAY_API_URL,
      workers:
        process.env
          .WORKDAY_WORKERS_ENDPOINT,
      timeTracking:
        process.env
          .WORKDAY_TIME_TRACKING_ENDPOINT,
    };

    process.env.WORKDAY_CLIENT_ID =
      "client-123";

    process.env.WORKDAY_CLIENT_SECRET =
      "secret-123";

    process.env.WORKDAY_TENANT =
      "tenant-123";

    process.env.WORKDAY_API_URL =
      "https://workday.example.com";

    process.env.WORKDAY_WORKERS_ENDPOINT =
      "/workers";

    process.env.WORKDAY_TIME_TRACKING_ENDPOINT =
      "/timeTracking";

    try {
      const config =
        getWorkdayConfig();

      assert.equal(
        config.clientId,
        "client-123"
      );

      assert.equal(
        config.clientSecret,
        "secret-123"
      );

      assert.equal(
        config.tenant,
        "tenant-123"
      );

      assert.equal(
        config.baseUrl,
        "https://workday.example.com"
      );

      assert.equal(
        config.endpoints.workers,
        "/workers"
      );

      assert.equal(
        config.endpoints.timeTracking,
        "/timeTracking"
      );
    } finally {
      restoreEnvironmentVariable(
        "WORKDAY_CLIENT_ID",
        originalValues.clientId
      );

      restoreEnvironmentVariable(
        "WORKDAY_CLIENT_SECRET",
        originalValues.clientSecret
      );

      restoreEnvironmentVariable(
        "WORKDAY_TENANT",
        originalValues.tenant
      );

      restoreEnvironmentVariable(
        "WORKDAY_API_URL",
        originalValues.apiUrl
      );

      restoreEnvironmentVariable(
        "WORKDAY_WORKERS_ENDPOINT",
        originalValues.workers
      );

      restoreEnvironmentVariable(
        "WORKDAY_TIME_TRACKING_ENDPOINT",
        originalValues.timeTracking
      );
    }
  }
);

function restoreEnvironmentVariable(
  name: string,
  value: string | undefined
): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}