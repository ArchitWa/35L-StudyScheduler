import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Minimal OAuth callback handler: stores access_token from URL hash, then redirects home
export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const hash = window.location.hash?.slice(1) || "";
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const err = params.get("error_description") || params.get("error");

      if (accessToken) {
        localStorage.setItem("auth_token", accessToken);
        // Clean hash and navigate home
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/", { replace: true });
        return;
      }

      setError(err || "Missing access token in callback");
    } catch (e) {
      setError("Failed to process callback");
    }
  }, [navigate]);

  if (!error) return null;

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign-in issue</h1>
      <p style={{ color: "#b00020" }}>{error}</p>
      <a href="/">Go home</a>
    </div>
  );
}

