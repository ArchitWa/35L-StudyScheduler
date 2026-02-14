import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";

const pageLayout =
  "min-h-screen flex flex-col items-center font-sans [background:linear-gradient(180deg,#1a4a8f_0%,#2d6cb5_30%,#f4f6f8_30%)]";
const card = "bg-white rounded-xl shadow-lg p-8 w-full max-w-[420px] m-4";
const title = "text-2xl font-bold text-[#1a4a8f] mb-2";
const subtitle = "text-gray-500 text-[0.95rem] mb-6";
const formClass = "flex flex-col gap-4";
const rowClass = "flex flex-col gap-1.5";
const labelClass = "text-sm font-semibold text-gray-800";
const inputClass =
  "px-3 py-2.5 border border-gray-300 rounded-md text-base focus:outline-none focus:border-[#1a4a8f] focus:ring-2 focus:ring-[#1a4a8f]/20";
const btnBase =
  "inline-block py-3 px-5 rounded-md text-base font-semibold text-center cursor-pointer border transition disabled:opacity-70 disabled:cursor-not-allowed";
const btnPrimary = "w-full mt-2 bg-[#1a4a8f] text-white border-0 hover:bg-[#153a75]";
const errorClass = "text-red-600 text-sm m-0";
const footerText = "mt-6 text-sm text-gray-500 text-center";
const linkClass = "text-[#1a4a8f] font-semibold no-underline hover:underline";

export default function SignUp() {
  const { isLoggedIn, loading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first: "",
    last: "",
    major: "",
    year: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          first: form.first.trim(),
          last: form.last.trim(),
          major: form.major.trim() || undefined,
          year: form.year.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (success) {
    return (
      <div className={pageLayout}>
        <header className="w-full py-5 px-10 text-left">
          <Link to="/" className="text-white text-xl font-semibold no-underline hover:underline">
            StudyScheduler
          </Link>
        </header>
        <div className={card}>
          <h1 className={title}>Account created</h1>
          <p className={subtitle}>
            You can now log in with Google (UCLA) or use your email next time we support it.
          </p>
          <Link to="/login" className={`${btnBase} ${btnPrimary}`}>
            Go to Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={pageLayout}>
      <header className="w-full py-5 px-10 text-left">
        <Link to="/" className="text-white text-xl font-semibold no-underline hover:underline">
          StudyScheduler
        </Link>
      </header>

      <div className={card}>
        <h1 className={title}>Sign up</h1>
        <p className={subtitle}>Create an account with your UCLA email.</p>

        <form onSubmit={handleSubmit} className={formClass}>
          <div className={rowClass}>
            <label className={labelClass} htmlFor="first">
              First name *
            </label>
            <input
              id="first"
              name="first"
              type="text"
              required
              autoComplete="given-name"
              value={form.first}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className={rowClass}>
            <label className={labelClass} htmlFor="last">
              Last name *
            </label>
            <input
              id="last"
              name="last"
              type="text"
              required
              autoComplete="family-name"
              value={form.last}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className={rowClass}>
            <label className={labelClass} htmlFor="email">
              UCLA email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@ucla.edu"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className={rowClass}>
            <label className={labelClass} htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className={rowClass}>
            <label className={labelClass} htmlFor="major">
              Major
            </label>
            <input
              id="major"
              name="major"
              type="text"
              autoComplete="organization-title"
              value={form.major}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className={rowClass}>
            <label className={labelClass} htmlFor="year">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="text"
              placeholder="e.g. 2025"
              value={form.year}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {error && <p className={errorClass} role="alert">{error}</p>}

          <button
            type="submit"
            className={`${btnBase} ${btnPrimary}`}
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className={footerText}>
          Already have an account?{" "}
          <Link to="/login" className={linkClass}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
