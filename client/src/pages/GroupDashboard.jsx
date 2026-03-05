import { useEffect, useState } from "react";
import { Navbar, CreateGroupModal, NewGroupCard } from "../components";

import { API_BASE, authHeaders } from "../lib/api.js";


export default function GroupDashboard() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);

    const [open, setOpen] = useState(false);


    useEffect(() => {
        const controller = new AbortController();

        async function getUser() {
            try {
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    headers: authHeaders(),
                    signal: controller.signal,
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch user info");
                }

                setCurrentUserId(data.user?.id || null);
            } catch (err) {
                if (err.name === "AbortError") return;
                console.error("Error fetching user info:", err);
            }
        }

        getUser();

        async function fetchMyGroups() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_BASE}/api/study-groups/mine`, {
                    method: "GET",
                    headers: {
                        ...authHeaders(),
                    },
                    signal: controller.signal,
                });

                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(payload.error || "Failed to load your groups.");
                }

                setGroups(Array.isArray(payload.groups) ? payload.groups : []);
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message || "Failed to load your groups.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchMyGroups();
        return () => controller.abort();
    }, []);
    
    console.log(groups)
    function handleRemoveGroup(groupId) {
        setGroups(prev => prev.filter(g => g.id !== groupId));
    }

    function handleCreateGroup(createdGroup) {
        if (!createdGroup) return;
        setGroups(prev => [createdGroup, ...prev]);
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="header-section">
                <Navbar />
            </header>

            {open && (
                <CreateGroupModal
                    onClose={() => setOpen(false)}
                    onCreated={handleCreateGroup}
                />
            )}

            <main className="max-w-6xl mx-auto px-6 py-8">
                <section className="max-w-4xl">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-2 text-sm text-indigo-700 rounded font-medium"
                        >
                            + Create Group
                        </button>
                    </div>

                    {loading && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                            <p className="text-gray-500 text-lg">Loading your groups...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 mb-4">
                            {error}
                        </div>
                    )}

                    {!loading && !error && groups.length === 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                            <p className="text-gray-500 text-lg">You are not in any groups yet.</p>
                        </div>
                    )}

                    {!loading && !error && groups.length > 0 && (
                        <div className="space-y-4">
                            {groups.map((group) => (
                                <NewGroupCard key={group.id} group={group} onLeave={handleRemoveGroup} currentUserId={currentUserId} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}