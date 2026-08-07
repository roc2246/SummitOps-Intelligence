import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  loginUser,
} from "../authApi";

describe("loginUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the email to the login endpoint", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            user: {
              id: "123",
              username: "supervisor",
              email: "supervisor@example.com",
              role: "supervisor",
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      );

    await loginUser(
      "supervisor@example.com"
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: "supervisor@example.com",
        }),
      }
    );
  });

  it("returns the login response", async () => {
    vi.spyOn(
      globalThis,
      "fetch"
    ).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,

          user: {
            id: "123",
            username: "supervisor",
            email: "supervisor@example.com",
            role: "supervisor",
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const result = await loginUser(
      "supervisor@example.com"
    );

    expect(result).toEqual({
      success: true,

      user: {
        id: "123",
        username: "supervisor",
        email: "supervisor@example.com",
        role: "supervisor",
      },
    });
  });

  it("throws the backend error message when login fails", async () => {
    vi.spyOn(
      globalThis,
      "fetch"
    ).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    await expect(
      loginUser(
        "missing@example.com"
      )
    ).rejects.toThrow(
      "User not found"
    );
  });

  it("throws a fallback message when the backend provides no message", async () => {
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
            "Content-Type": "application/json",
          },
        }
      )
    );

    await expect(
      loginUser(
        "supervisor@example.com"
      )
    ).rejects.toThrow(
      "Login failed"
    );
  });
});