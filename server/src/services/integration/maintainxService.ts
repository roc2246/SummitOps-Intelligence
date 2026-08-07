import {
  getMaintainXConfig,
} from "./integrationConfig.js";

import type {
  MaintainXWorkOrder,
} from "./integrationTypes.js";

export async function fetchMaintainXWorkOrders(): Promise<
  MaintainXWorkOrder[]
> {
  const config =
    getMaintainXConfig();

  const endpoint =
    `${config.baseUrl}${config.endpoints.workOrders}`;

  /*
   * Future implementation:
   *
   * const response = await fetch(
   *   endpoint,
   *   {
   *     headers: {
   *       Authorization:
   *         `Bearer ${config.apiKey}`,
   *     },
   *   }
   * );
   */

  throw new Error(
    `MaintainX integration is not implemented yet. Endpoint: ${endpoint}`
  );
}