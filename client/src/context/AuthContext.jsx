import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE, authHeaders } from "../lib/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeaders() });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
      setProfile(data.profile ?? null);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const setToken = useCallback(
    (token) => {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setProfile(null);
      fetchUser();
    },
    [fetchUser]
  );

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${API_BASE}/api/auth/login`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", headers: authHeaders() });
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setProfile(null);
    }
  }, []);

  const value = {
    user,
    profile,
    loading,
    isLoggedIn: !!user,
    setToken,
    fetchUser,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
