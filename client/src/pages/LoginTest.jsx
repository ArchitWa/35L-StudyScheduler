import React, { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";

const API = "http://localhost:3000/api/auth";

export default function LoginTest() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Check existing login on page load
    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        const token = localStorage.getItem("auth_token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Session invalid");

            const data = await res.json();
            setUser(data.user);
        } catch {
            localStorage.removeItem("auth_token");
            setUser(null);
        }

        setLoading(false);
    }

    // ✅ Login
    function login() {
        window.location.href = `${API}/login`;
    }

    // ✅ Logout

    async function logout() {
        await supabase.auth.signOut();

        localStorage.removeItem("auth_token");

        setUser(null);
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-lg">Checking session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Study Group Auth
                </h1>

                {!user ? (
                    <>
                        <p className="text-gray-600 text-center mb-6">
                            Sign in with your UCLA account
                        </p>

                        <button
                            onClick={login}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                        >
                            Login with Google
                        </button>
                    </>
                ) : (
                    <>
                        <div className="text-center space-y-3">
                            <div className="text-green-600 text-lg font-semibold">
                                ✅ Logged In
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{user.email}</p>
                                <p className="text-xs text-gray-500 break-all">
                                    {user.id}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}

                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}
            </div>
        </div>
    );
}