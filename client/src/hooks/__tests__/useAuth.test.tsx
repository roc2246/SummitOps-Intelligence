import "@testing-library/jest-dom";

// Note: The filename has a typo. It should be useAuth.test.ts instead of useAth.test.ts

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import {
  AuthProvider,
} from "../../context/AuthContext";

import {
  useAuth,
} from "../useAuth";

function TestComponent() {
  const {
    user,
  } = useAuth();

  return (
    <p>
      {user?.email ??
        "Not logged in"}
    </p>
  );
}

describe("useAuth", () => {
  it("returns authentication context when inside AuthProvider", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByText(
        "Not logged in"
      )
    ).toBeInTheDocument();
  });

  it("throws when used outside AuthProvider", () => {
    expect(() => {
      render(
        <TestComponent />
      );
    }).toThrow(
      "useAuth must be used within an AuthProvider"
    );
  });
});