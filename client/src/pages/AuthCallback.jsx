import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const pageLayout =
  "min-h-screen flex flex-col items-center font-sans [background:linear-gradient(180deg,#1a4a8f_0%,#2d6cb5_30%,#f4f6f8_30%)]";
const card = "bg-white rounded-xl shadow-lg p-8 w-full max-w-[420px] m-4";
const title = "text-2xl font-bold text-[#1a4a8f] mb-2";
const btnBase =
  "inline-block py-3 px-5 rounded-md text-base font-semibold text-center cursor-pointer border-0 transition";
const btnPrimary = "w-full mt-2 bg-[#1a4a8f] text-white hover:bg-[#153a75]";

/**
 * Handles OAuth redirect from Supabase (Google). Supabase puts tokens in the URL hash.
 * We parse access_token and store it, then redirect to home.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash?.slice(1) || "";
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      setToken(accessToken);
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/", { replace: true });
      return;
    }

    const err = params.get("error_description") || params.get("error") || "Missing token";
    setError(err);
  }, [setToken, navigate]);

  if (error) {
    return (
      <div className={pageLayout}>
        <div className={card}>
          <h1 className={title}>Sign-in issue</h1>
          <p className="text-red-600 text-sm m-0" role="alert">{error}</p>
          <a href="/login" className={`${btnBase} ${btnPrimary}`}>
            Back to Log in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={pageLayout}>
      <div className={card}>
        <p className="text-gray-500 m-0">Signing you in…</p>
      </div>
    </div>
  );
}
