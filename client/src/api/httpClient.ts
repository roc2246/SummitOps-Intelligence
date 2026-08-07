const API_BASE_URL = "http://localhost:5000";

interface ApiErrorResponse {
  message?: string;
}

function buildHeaders(
  token?: string,
  includeJsonContentType = false
): HeadersInit {
  const headers: HeadersInit = {};

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readJson<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("Content-Type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}

export async function getJson<T>(
  path: string,
  options?: {
    token?: string;
    fallbackErrorMessage?: string;
  }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildHeaders(options?.token),
  });

  const data = await readJson<T | ApiErrorResponse>(response);

  if (!response.ok) {
    throw new Error(
      (data as ApiErrorResponse | null)?.message ??
        options?.fallbackErrorMessage ??
        "Request failed"
    );
  }

  return (data as T) ?? ({} as T);
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
  options?: {
    token?: string;
    fallbackErrorMessage?: string;
  }
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(options?.token, true),
    body: JSON.stringify(body),
  });

  const data = await readJson<TResponse | ApiErrorResponse>(response);

  if (!response.ok) {
    throw new Error(
      (data as ApiErrorResponse | null)?.message ??
        options?.fallbackErrorMessage ??
        "Request failed"
    );
  }

  return (data as TResponse) ?? ({} as TResponse);
}
