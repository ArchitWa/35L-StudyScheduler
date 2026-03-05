import { useState, useRef, useEffect } from "react";

import { HiDotsVertical } from "react-icons/hi";
import { API_BASE } from "../lib/api";
import ClassPill from "./ClassPill";
import { formatTime, normalizeClasses } from "../lib/helpers";

export default function GroupCard({ group, currentUserId, onLeave }) {
    const classList = normalizeClasses(group?.classes);
    const users = Array.isArray(group?.users) ? group.users.filter(Boolean) : [];
    const isOwner = group?.group_owner === currentUserId;

    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
    const [leaveError, setLeaveError] = useState("");
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);

    // close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
                setConfirmLeaveOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLeave() {
        if (!group?.id) return;

        try {
            setLoading(true);
            setLeaveError("");

            const res = await fetch(
                `${API_BASE}/api/study-groups/${group.id}/leave`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                    },
                }
            );

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setLeaveError(data.error || "Failed to leave group");
                return;
            }

            // Remove from UI
            if (onLeave) onLeave(group.id);

        } catch (err) {
            console.error(err);
            setLeaveError("Something went wrong while leaving the group");
        } finally {
            setLoading(false);
            setMenuOpen(false);
            setConfirmLeaveOpen(false);
        }
    }

    return (
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">

            {/* 3 Dot Menu */}
            <div className="absolute top-4 right-4" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                >
                    <HiDotsVertical />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">

                        {isOwner && (
                            <button
                                onClick={() => {
                                    // setMenuOpen(false);
                                    // TODO: navigate to edit page or open edit modal
                                    console.log("Edit group");
                                }}
                                className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                            >
                                Edit Group
                            </button>
                        )}

                        <button
                            onClick={() => {
                                // setConfirmLeaveOpen(true);
                                // setMenuOpen(false);
                                console.log("Leave group");
                            }}
                            disabled={loading}
                            className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Leave Group
                        </button>
                    </div>
                )}

                {confirmLeaveOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-3">
                        <p className="text-sm text-gray-700 mb-3">Leave this group? You can request to join again later.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setConfirmLeaveOpen(false)}
                                className="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleLeave}
                                className="px-3 py-1.5 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100"
                                disabled={loading}
                            >
                                {loading ? "Leaving..." : "Leave"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {leaveError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {leaveError}
                </div>
            )}

            {/* Title */}
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    {group?.group_name || "Untitled Group"}
                </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                {group?.goals || "No group goals listed."}
            </p>

            {/* Meeting Link */}
            <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Study Location
                </p>
                {group?.meet_spot ? (
                    <a
                        href={group.meet_spot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-700 break-all"
                    >
                        {group.meet_spot}
                    </a>
                ) : (
                    <p className="text-sm text-gray-500">None provided</p>
                )}
            </div>

            {/* Schedule */}
            <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Schedule
                </p>
                <p className="text-sm text-gray-700">
                    {group?.day_of_week || "TBD"} {formatTime(group?.time)}
                </p>
            </div>

            {/* Classes */}
            <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Classes
                </p>
                <div className="flex flex-wrap gap-2">
                    {classList.length > 0 ? (
                        classList.map((classItem) => (
                            <ClassPill key={classItem} value={classItem} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No classes listed</p>
                    )}
                </div>
            </div>

            {/* Members */}
            <div className="flex items-center">
                <div className="flex -space-x-2">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <img
                                key={user.id || `${group?.id}-user-${index}`}
                                src={user.avatar_url || "https://i.pravatar.cc/100?img=1"}
                                alt="member avatar"
                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                            />
                        ))
                    ) : (
                        <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-200" />
                    )}
                </div>

                <span className="ml-3 text-sm text-gray-500">
                    {users.length} member{users.length !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
}