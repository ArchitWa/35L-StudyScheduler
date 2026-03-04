import { useState } from "react";
import classes from "../lib/classes.json";
import ClassPill from "./ClassPill";

const API = "http://localhost:3000/api/study-groups";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

function generateTimes(startHour = 8, endHour = 21) {
    const times = [];

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute of [0]) {
            const date = new Date();
            date.setHours(hour, minute, 0);

            const label = date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

            const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

            times.push({ value, label });
        }
    }

    return times;
}

const TIMES = generateTimes(8, 21);

export default function CreateGroupModal({ onClose, onCreated }) {
    const [form, setForm] = useState({
        group_name: "",
        day_of_week: "",
        time: "",
        zoom_link: "",
        classes: [],
        goals: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [classPickerValue, setClassPickerValue] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError("");
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
        setError("");
    }

    function removeClass(selectedClass) {
        setForm(prev => ({
            ...prev,
            classes: prev.classes.filter(c => c !== selectedClass)
        }));
        setError("");
    }

    function validate() {
        if (!form.group_name.trim()) return "Group name required";
        if (!form.day_of_week) return "Select a day";
        if (!form.time) return "Select a time";
        if (form.classes.length === 0) return "Select at least one class";
        if (!form.goals.trim()) return "Goals required";
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

            const res = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to create group");

            onCreated?.(data.group);
            onClose();
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create Study Group</h2>
                        <p className="text-sm text-gray-500">Fill out the details below to set up your group.</p>
                        <p className="text-xs text-gray-400 mt-1">Fields marked with <span className="text-red-500">*</span> are required.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 w-9 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-5 space-y-5">
                    <div>
                        <label htmlFor="group_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Group Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="group_name"
                            name="group_name"
                            placeholder="Group Name"
                            value={form.group_name}
                            onChange={handleChange}
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 mb-1">
                                Day <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="day_of_week"
                                name="day_of_week"
                                value={form.day_of_week}
                                onChange={handleChange}
                                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            >
                                <option value="">Select Day</option>
                                {DAYS.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Time <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            >
                                <option value="">Select Time</option>
                                {TIMES.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="zoom_link" className="block text-sm font-medium text-gray-700 mb-1">
                            Zoom Link <span className="text-xs text-gray-400">(optional)</span>
                        </label>
                        <input
                            id="zoom_link"
                            name="zoom_link"
                            placeholder="https://..."
                            value={form.zoom_link}
                            onChange={handleChange}
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="classes" className="block text-sm font-medium text-gray-700 mb-1">
                            Classes <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="classes"
                            name="classes"
                            value={classPickerValue}
                            onChange={handleClassChange}
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                                        value={cls}
                                        removable
                                        onRemove={removeClass}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                            Group Goals <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="goals"
                            name="goals"
                            placeholder="Group Goals"
                            value={form.goals}
                            onChange={handleChange}
                            rows="4"
                            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-4 py-2 text-sm text-indigo-700 rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}