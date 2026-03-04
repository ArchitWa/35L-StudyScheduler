/**
 * API base URL for backend. Use VITE_API_URL in .env (e.g. http://localhost:3000)
 * or relative path when same-origin / proxied.
 */
export const API_BASE =
  typeof import.meta.env?.VITE_API_URL === "string" && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "";

export function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
