// lib/api.ts
const API_URL = "http://localhost:3001"; // adapte selon ton env

let isRefreshing = false;

async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh token invalide");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken || accessToken.trim() === "") {
    console.warn("Token manquant → logout forcé");
    localStorage.clear();
    window.location.href = "/login"; // active si besoin
    throw new Error("Token manquant");
  }

  const makeRequest = async (token: string | null) => {
    return fetch(typeof input === "string" ? `${API_URL}${input}` : input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });
  };

  let res = await makeRequest(accessToken);

  // Si token expiré, tente un refresh
  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true;
    try {
      accessToken = await refreshToken();
      isRefreshing = false;
      res = await makeRequest(accessToken);
    } catch (err) {
      console.warn("Session expirée, redirection login");
      localStorage.clear();
    }
  }

  return res;
}

// Helpers
export const api = {
  get: (url: string) => fetchWithAuth(url),
  post: (url: string, body: any) =>
    fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (url: string, body: any) =>
    fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: (url: string, body: any) =>
    fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (url: string) =>
    fetchWithAuth(url, {
      method: "DELETE",
    }),
};
