import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchWorkdayLaborRecords,
} from "../workdayService.js";

test(
  "fetchWorkdayLaborRecords throws a not implemented error",
  async () => {
    const originalEndpoint =
      process.env.WORKDAY_TIME_TRACKING_ENDPOINT;

    process.env.WORKDAY_TIME_TRACKING_ENDPOINT =
      "/timeTracking";

    try {
      await assert.rejects(
        fetchWorkdayLaborRecords(),
        {
          message:
            "Workday integration is not implemented yet. Endpoint: /timeTracking",
        }
      );
    } finally {
      if (
        originalEndpoint === undefined
      ) {
        delete process.env
          .WORKDAY_TIME_TRACKING_ENDPOINT;
      } else {
        process.env
          .WORKDAY_TIME_TRACKING_ENDPOINT =
          originalEndpoint;
      }
    }
  }
);

test(
  "fetchWorkdayLaborRecords reports when the endpoint is not configured",
  async () => {
    const originalEndpoint =
      process.env.WORKDAY_TIME_TRACKING_ENDPOINT;

    delete process.env
      .WORKDAY_TIME_TRACKING_ENDPOINT;

    try {
      await assert.rejects(
        fetchWorkdayLaborRecords(),
        {
          message:
            "Workday integration is not implemented yet. Endpoint: not configured",
        }
      );
    } finally {
      if (
        originalEndpoint !== undefined
      ) {
        process.env.WORKDAY_TIME_TRACKING_ENDPOINT =
          originalEndpoint;
      }
    }
  }
);