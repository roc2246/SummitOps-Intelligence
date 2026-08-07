import "@testing-library/jest-dom";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  AuthProvider,
  AuthContext,
} from "../AuthContext";

import {
  useContext,
} from "react";

function TestConsumer() {
  const auth =
    useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const fakeUser = {
    id: "123",
    username: "supervisor",
    email: "supervisor@example.com",
    role: "supervisor",
  };

  return (
    <div>
      <p data-testid="user">
        {auth.user?.email ??
          "No user"}
      </p>

      <button
        onClick={() =>
          auth.login(fakeUser)
        }
      >
        Login
      </button>

      <button
        onClick={auth.logout}
      >
        Logout
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("starts with no authenticated user", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent(
      "No user"
    );
  });

  it("stores a user when login is called", async () => {
    const user =
      userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: "Login",
        }
      )
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent(
      "supervisor@example.com"
    );
  });

  it("removes the user when logout is called", async () => {
    const user =
      userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: "Login",
        }
      )
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent(
      "supervisor@example.com"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: "Logout",
        }
      )
    );

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent(
      "No user"
    );
  });
});