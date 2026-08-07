import { useState } from "react";
import type { FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(email);
  }

  return (
    <div className="login-page">
      <h1 className="login-page__title">Login</h1>

      <form className="login-page__form" onSubmit={handleSubmit}>
        <label className="login-page__label" htmlFor="email">
          Email:
        </label>

        <input
          className="login-page__input"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className="login-page__label" htmlFor="password">
          Password:
        </label>

        <input
          className="login-page__input"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button className="login-page__button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
