import { postJson } from "./httpClient";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await postJson<LoginResponse, { email: string; password: string }>(
    "/api/auth/login",
    {
      email,
      password,
    },
    {
      fallbackErrorMessage: "Login failed",
    }
  );

  if (!data.user || !data.token) {
    throw new Error(
      "Login response did not include authentication data"
    );
  }

  return data;
}