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

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
} from "../../context/AuthContext";

import {
  useAuth,
} from "../../hooks/useAuth";

import ProtectedRoute from "../ProtectedRoute";

function ProtectedContent() {
  return (
    <h1>
      Protected Content
    </h1>
  );
}

function LoginPageMock() {
  return (
    <h1>
      Login Page
    </h1>
  );
}

function LoginBeforeProtectedRoute() {
  const {
    login,
  } = useAuth();

  login({
    id: "123",
    username: "supervisor",
    email: "supervisor@example.com",
    role: "supervisor",
  });

  return (
    <ProtectedRoute>
      <ProtectedContent />
    </ProtectedRoute>
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
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
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <LoginPageMock />
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole(
        "heading",
        {
          name: "Login Page",
        }
      )
    ).toBeInTheDocument();
  });

  it("renders protected content for an authenticated user", () => {
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
                <LoginBeforeProtectedRoute />
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole(
        "heading",
        {
          name: "Protected Content",
        }
      )
    ).toBeInTheDocument();
  });
});