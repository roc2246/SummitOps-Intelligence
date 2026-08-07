export function getMaintainXConfig() {
  return {
    apiKey:
      process.env.MAINTAINX_API_KEY,

    baseUrl:
      process.env.MAINTAINX_API_URL ??
      "https://api.getmaintainx.com/v1",

    endpoints: {
      workOrders:
        "/workorders",
      workRequests:
        "/workrequests",
      assets:
        "/assets",
    },
  };
}

export function getWorkdayConfig() {
  return {
    clientId:
      process.env.WORKDAY_CLIENT_ID,

    clientSecret:
      process.env.WORKDAY_CLIENT_SECRET,

    tenant:
      process.env.WORKDAY_TENANT,

    baseUrl:
      process.env.WORKDAY_API_URL,

    endpoints: {
      workers:
        process.env.WORKDAY_WORKERS_ENDPOINT,

      timeTracking:
        process.env.WORKDAY_TIME_TRACKING_ENDPOINT,
    },
  };
}