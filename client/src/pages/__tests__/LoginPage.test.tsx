import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../../context/AuthContext";

import LoginPage from "../LoginPage";

vi.mock("../../api/authApi", () => ({
  loginUser: vi.fn(),
}));

describe("LoginPage", () => {
  function renderLoginPage() {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
  }

  it("renders the login form", () => {
    renderLoginPage();

    expect(
      screen.getByRole("heading", {
        name: /login/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /login/i,
      })
    ).toBeInTheDocument();
  });

  it("allows the user to enter an email and password", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    const emailInput =
      screen.getByLabelText(/email/i);

    const passwordInput =
      screen.getByLabelText(/password/i);

    await user.type(
      emailInput,
      "supervisor@example.com"
    );

    await user.type(
      passwordInput,
      "password123"
    );

    expect(emailInput).toHaveValue(
      "supervisor@example.com"
    );

    expect(passwordInput).toHaveValue(
      "password123"
    );
  });
});