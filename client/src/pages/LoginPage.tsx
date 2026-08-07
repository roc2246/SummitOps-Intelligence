import { useState } from "react";

import type {
  FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
} from "../api/authApi";

import {
  useAuth,
} from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const {
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const result =
        await loginUser(
          email,
          password
        );

      if (!result.user || !result.token) {
        throw new Error(
          "Login response did not include authentication data"
        );
      }

      login(
        result.user,
        result.token
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h1 className="login-page__title">
        Login
      </h1>

      <form
        className="login-page__form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        <label
          className="login-page__label"
          htmlFor="email"
        >
          Email:
        </label>

        <input
          className="login-page__input"
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "login-form-error"
              : undefined
          }
          required
        />

        <label
          className="login-page__label"
          htmlFor="password"
        >
          Password:
        </label>

        <input
          className="login-page__input"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "login-form-error"
              : undefined
          }
          required
        />

        {error && (
          <p
            id="login-form-error"
            className="login-page__error"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        <button
          className="login-page__button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}