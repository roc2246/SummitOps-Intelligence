import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchMaintainXWorkOrders,
} from "../maintainxService.js";

test(
  "fetchMaintainXWorkOrders throws a not implemented error",
  async () => {
    await assert.rejects(
      fetchMaintainXWorkOrders(),
      {
        message:
          "MaintainX integration is not implemented yet. Endpoint: https://api.getmaintainx.com/v1/workorders",
      }
    );
  }
);