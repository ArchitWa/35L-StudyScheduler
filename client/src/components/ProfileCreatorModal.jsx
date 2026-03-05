import { useEffect, useRef, useState } from "react";
import classes from "../lib/classes.json";
import ClassPill from "./ClassPill";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";

const MODAL_ANIMATION_MS = 200;
const ERROR_VISIBLE_MS = 3000;
const ERROR_FADE_MS = 300;

const YEARS = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior"
];

export default function ProfileCreatorModal({ onCreated }) {
    const { fetchUser } = useAuth();
    const [form, setForm] = useState({
        name: "",
        major: "",
        year: "",
        phone: "",
        bio: "",
        classes: []
    });

    const [error, setError] = useState("");
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [classPickerValue, setClassPickerValue] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const errorFadeTimeoutRef = useRef(null);
    const errorClearTimeoutRef = useRef(null);

    function clearErrorTimers() {
        if (errorFadeTimeoutRef.current) {
            clearTimeout(errorFadeTimeoutRef.current);
            errorFadeTimeoutRef.current = null;
        }
        if (errorClearTimeoutRef.current) {
            clearTimeout(errorClearTimeoutRef.current);
            errorClearTimeoutRef.current = null;
        }
    }

    function dismissError() {
        clearErrorTimers();
        setIsErrorVisible(false);
        setError("");
    }

    useEffect(() => {
        if (!error) return;

        clearErrorTimers();
        setIsErrorVisible(true);

        errorFadeTimeoutRef.current = setTimeout(() => {
            setIsErrorVisible(false);
        }, ERROR_VISIBLE_MS);

        errorClearTimeoutRef.current = setTimeout(() => {
            setError("");
        }, ERROR_VISIBLE_MS + ERROR_FADE_MS);

        return () => {
            clearErrorTimers();
        };
    }, [error]);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            setIsVisible(true);
        });

        return () => {
            cancelAnimationFrame(animationFrame);
            clearErrorTimers();
        };
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        dismissError();
    }

    function handleClassChange(e) {
        const selectedClass = e.target.value;
        setClassPickerValue("");
        if (!selectedClass) return;

        setForm(prev => {
            if (prev.classes.includes(selectedClass)) return prev;
            return {
                ...prev,
                classes: [...prev.classes, selectedClass]
            };
        });
        dismissError();
    }

    function removeClass(selectedClass) {
        setForm(prev => ({
            ...prev,
            classes: prev.classes.filter(c => c !== selectedClass)
        }));
        dismissError();
    }

    function validate() {
        if (!form.name.trim()) return "Name is required";
        if (!form.major.trim()) return "Major is required";
        if (!form.year) return "Year is required";
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("auth_token");

            const res = await fetch(`${API_BASE}/api/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to create profile");

            // Refresh the user profile in the context
            await fetchUser();
            onCreated?.(data.user);
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-200 ease-out ${isVisible ? "bg-black/40" : "bg-black/0"}`}
        >
            <div
                className={`w-full max-w-xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-200 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create Your Profile</h2>
                        <p className="text-sm text-gray-500">Set up your profile to get started.</p>
                        <p className="text-xs text-gray-400 mt-1">Fields marked with <span className="text-red-500">*</span> are required.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-5 space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                                Major <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="major"
                                name="major"
                                placeholder="Your major"
                                value={form.major}
                                onChange={handleChange}
                                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="year"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                className="w-full text-black rounded-lg border border-gray-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            >
                                <option value="">Select Year</option>
                                {YEARS.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number <span className="text-xs text-gray-400">(optional)</span>
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            placeholder="(555) 123-4567"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Bio <span className="text-xs text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            placeholder="Tell us about yourself..."
                            value={form.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="classes" className="block text-sm font-medium text-gray-700 mb-1">
                            Classes <span className="text-xs text-gray-400">(optional)</span>
                        </label>
                        <select
                            id="classes"
                            name="classes"
                            value={classPickerValue}
                            onChange={handleClassChange}
                            className="w-full text-black rounded-lg border border-gray-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        >
                            <option value="">Select Class to Add</option>
                            {classes.filter(cls => !form.classes.includes(cls)).map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                        {form.classes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {form.classes.map((cls) => (
                                    <ClassPill
                                        key={cls}
                                        value={cls}
                                        removable
                                        onRemove={removeClass}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div
                            className={`rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition-opacity duration-300 ${isErrorVisible ? "opacity-100" : "opacity-0"}`}
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-4 py-2 text-sm text-indigo-700 rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
