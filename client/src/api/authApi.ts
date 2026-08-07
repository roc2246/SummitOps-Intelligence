export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export async function loginUser(
  email: string
): Promise<LoginResponse> {
  const response = await fetch(
    "./api/auth/login",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
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

  return data;
}