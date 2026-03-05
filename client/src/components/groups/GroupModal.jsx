import { useEffect, useRef, useState } from "react";
import ClassPill from "../ClassPill";
import { API_BASE } from "../../lib/api.js";
import { formatTime, normalizeClasses } from "../../lib/helpers.js";

const MODAL_ANIMATION_MS = 200;

export default function GroupModal({ group, onClose, onLeave }) {
    const [loading, setLoading] = useState(false);
    const [leaveError, setLeaveError] = useState("");
    const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const closeTimeoutRef = useRef(null);

    function requestClose() {
        if (isClosing) return;
        setIsClosing(true);
        setIsVisible(false);

        closeTimeoutRef.current = setTimeout(() => {
            if (onClose) onClose();
        }, MODAL_ANIMATION_MS);
    }

    const classList = normalizeClasses(group?.classes);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const animationFrame = requestAnimationFrame(() => {
            setIsVisible(true);
        });

        return () => {
            cancelAnimationFrame(animationFrame);
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    async function handleLeave() {
        if (!group?.id) return;

        try {
            setLoading(true);
            setLeaveError("");

            const res = await fetch(`${API_BASE}/api/study-groups/${group.id}/leave`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setLeaveError(data.error || "Failed to leave group");
                return;
            }

            if (onLeave) onLeave(group.id);
            requestClose();
        } catch (err) {
            console.error(err);
            setLeaveError("Something went wrong while leaving the group");
        } finally {
            setLoading(false);
            setConfirmLeaveOpen(false);
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-200 ease-out ${isVisible ? "bg-black/40" : "bg-black/0"}`}
        >
            <div
                className={`relative w-full max-w-xl overflow-hidden rounded-xl border ${confirmLeaveOpen ? 'border-black/25' : 'border-gray-200'} bg-white shadow-xl transition-all duration-200 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Study Group Details</h2>
                        <p className="text-sm text-gray-500">Viewing this group in read-only mode.</p>
                    </div>
                    <button
                        type="button"
                        onClick={requestClose}
                        className="h-9 w-9 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="relative px-6 py-5 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                        <input
                            type="text"
                            value={group?.group_name || ""}
                            readOnly
                            disabled
                            className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                            <input
                                type="text"
                                value={group?.day_of_week || ""}
                                readOnly
                                disabled
                                className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
                            <input
                                type="text"
                                value={formatTime(group?.time)}
                                readOnly
                                disabled
                                className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Study Location</label>
                        <input
                            type="text"
                            value={group?.meet_spot || ""}
                            readOnly
                            disabled
                            className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Classes</label>
                        <div className="w-full min-h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
                            {classList.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {classList.map((classItem) => (
                                        <ClassPill key={classItem} value={classItem} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No classes listed</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Goals</label>
                        <textarea
                            value={group?.goals || ""}
                            readOnly
                            disabled
                            rows="4"
                            className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
                        />
                    </div>

                    {leaveError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {leaveError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={requestClose}
                            className="cursor-pointer px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={() => setConfirmLeaveOpen(true)}
                            disabled={loading}
                            className="cursor-pointer px-4 py-2 text-sm rounded bg-red-50 text-red-700 font-medium hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Leave Group
                        </button>
                    </div>
                </div>

                {confirmLeaveOpen && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/25  p-4">
                        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-lg p-4">
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
                                    {loading ? "Leaving..." : "Confirm Leave"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
