const BASE_URL = "http://127.0.0.1:8000";

export async function api<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API error:", text);

    // pass status code to frontend
    throw new Error(String(res.status));
  }

  return res.json();
}
