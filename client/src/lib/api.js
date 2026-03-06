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

export async function fetchStudyGroups() {
  const response = await fetch(`${API_BASE}/api/study-groups`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch study groups');
  }
  const data = await response.json();
  return data.groups;
}

export async function getUser() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: authHeaders(),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch user info");
    }

    return data.user?.id || null;
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error("Error fetching user info:", err);
  }
}

export async function fetchGroupDetails(groupId) {
  const response = await fetch(`${API_BASE}/api/study-groups/${groupId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch group details');
  }
  const data = await response.json();
  return data;
}
