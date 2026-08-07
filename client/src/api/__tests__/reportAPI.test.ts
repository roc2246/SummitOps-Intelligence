import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createWeeklyReport,
} from "../reportAPI";

describe("createWeeklyReport", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const input = {
    departmentId: "6895cd84173241d61e612345",
    weekStart: "2026-08-02T00:00:00.000Z",
    weekEnd: "2026-08-08T23:59:59.999Z",
  };

  const userId =
    "6895cd84173241d61e612346";

  const report = {
    _id: "6895cd84173241d61e612347",
    department: input.departmentId,
    weekStart: input.weekStart,
    weekEnd: input.weekEnd,
    status: "draft",

    metrics: {
      openedWorkOrders: 4,
      completedWorkOrders: 2,
      overdueWorkOrders: 1,
      openBacklog: 2,
      completionRate: 50,
      totalLaborHours: 12.5,
    },
  };

  it("sends a POST request to the weekly report endpoint", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify(report),
          {
            status: 201,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        )
      );

    await createWeeklyReport(
      input,
      userId
    );

    expect(
      fetchMock
    ).toHaveBeenCalledTimes(1);

    expect(
      fetchMock
    ).toHaveBeenCalledWith(
      "http://localhost:5000/api/reports/weekly",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "x-user-id":
            userId,
        },

        body:
          JSON.stringify(input),
      }
    );
  });

  it("returns the created weekly report", async () => {
    vi.spyOn(
      globalThis,
      "fetch"
    ).mockResolvedValue(
      new Response(
        JSON.stringify(report),
        {
          status: 201,

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      )
    );

    const result =
      await createWeeklyReport(
        input,
        userId
      );

    expect(result).toEqual(
      report
    );
  });

  it("sends the user id in the authentication header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify(report),
          {
            status: 201,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        )
      );

    await createWeeklyReport(
      input,
      userId
    );

    expect(
      fetchMock
    ).toHaveBeenCalledWith(
      expect.any(String),

      expect.objectContaining({
        headers: expect.objectContaining({
          "x-user-id":
            userId,
        }),
      })
    );
  });

  it("sends the report input as JSON", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify(report),
          {
            status: 201,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        )
      );

    await createWeeklyReport(
      input,
      userId
    );

    expect(
      fetchMock
    ).toHaveBeenCalledWith(
      expect.any(String),

      expect.objectContaining({
        body:
          JSON.stringify(input),
      })
    );
  });

  it("throws the backend error message when report creation fails", async () => {
    vi.spyOn(
      globalThis,
      "fetch"
    ).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          message:
            "Invalid departmentId",
        }),
        {
          status: 400,

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      )
    );

    await expect(
      createWeeklyReport(
        input,
        userId
      )
    ).rejects.toThrow(
      "Invalid departmentId"
    );
  });

  it("throws a fallback error when the backend does not provide a message", async () => {
    vi.spyOn(
      globalThis,
      "fetch"
    ).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
        }),
        {
          status: 500,

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      )
    );

    await expect(
      createWeeklyReport(
        input,
        userId
      )
    ).rejects.toThrow(
      "Failed to create weekly report"
    );
  });
});