import {
  getWorkdayConfig,
} from "./integrationConfig.js";

import type {
  WorkdayLaborRecord,
} from "./integrationTypes.js";

export async function fetchWorkdayLaborRecords(): Promise<
  WorkdayLaborRecord[]
> {
  const config =
    getWorkdayConfig();

  const endpoint =
    config.endpoints.timeTracking;

  /*
   * Future implementation:
   *
   * const response = await fetch(
   *   `${config.baseUrl}${endpoint}`,
   *   {
   *     headers: {
   *       Authorization:
   *         `Bearer ${accessToken}`,
   *     },
   *   }
   * );
   */

  throw new Error(
    `Workday integration is not implemented yet. Endpoint: ${
      endpoint ?? "not configured"
    }`
  );
}