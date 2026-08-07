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
  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(
      data.message ?? "Login failed"
    );
  }

  if (!data.user || !data.token) {
    throw new Error(
      "Login response did not include authentication data"
    );
  }

  return data;
}