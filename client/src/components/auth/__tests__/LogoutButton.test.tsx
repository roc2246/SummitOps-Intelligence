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
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
} from "../../../context/AuthContext";

import LogoutButton from "../LogoutButton";

function DashboardMock() {
  return (
    <div>
      <h1>
        Dashboard
      </h1>

      <LogoutButton />
    </div>
  );
}

function LoginMock() {
  return (
    <h1>
      Login Page
    </h1>
  );
}

describe("LogoutButton", () => {
  it("renders the logout button", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LogoutButton />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole(
        "button",
        {
          name: /logout/i,
        }
      )
    ).toBeInTheDocument();
  });

  it("redirects to login when clicked", async () => {
    const user =
      userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          "/dashboard",
        ]}
      >
        <AuthProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <DashboardMock />
              }
            />

            <Route
              path="/login"
              element={
                <LoginMock />
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /logout/i,
        }
      )
    );

    expect(
      await screen.findByRole(
        "heading",
        {
          name: /login page/i,
        }
      )
    ).toBeInTheDocument();
  });
});