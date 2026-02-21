import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const pageLayout =
  "min-h-screen flex flex-col items-center font-sans [background:linear-gradient(180deg,#1a4a8f_0%,#2d6cb5_30%,#f4f6f8_30%)]";
const card =
  "bg-white rounded-xl shadow-lg p-8 w-full max-w-[420px] m-4";
const title = "text-2xl font-bold text-[#1a4a8f] mb-2";
const subtitle = "text-gray-500 text-[0.95rem] mb-6";
const btnBase =
  "inline-block py-3 px-5 rounded-md text-base font-semibold text-center cursor-pointer border transition disabled:opacity-70 disabled:cursor-not-allowed";
const btnGoogle =
  "w-full bg-white text-white border-0 hover:bg-white";
const footerText = "mt-6 text-sm text-gray-500 text-center";
const link = "text-[#1a4a8f] font-semibold no-underline hover:underline";

export default function Login() {
  const { isLoggedIn, loading, loginWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className={pageLayout}>
        <div className={card}>
          <p className="text-gray-500 m-0">Loading…</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={pageLayout}>
      <header className="w-full py-5 px-10 text-left">
        <Link to="/" className="brand-title text-white no-underline hover:underline">
          StudyScheduler
        </Link>
      </header>

      <div className={card}>
        <h1 className={title}>Log in</h1>
        <p className={subtitle}>Use your UCLA Google account to continue.</p>

        <button
          type="button"
          className={`${btnBase} ${btnGoogle}`}
          onClick={loginWithGoogle}
        >
          Sign in with Google (UCLA)
        </button>

        <p className={footerText}>
          Don’t have an account?{" "}
          <Link to="/signup" className={link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
