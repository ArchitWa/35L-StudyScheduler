import Navbar from "../components/navbar.jsx";
import { Link } from "react-router-dom";
import { placeholderClasses, placeholderGroups, placeholderSchedules } from "./placeholders.jsx";
import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "../lib/api.js";
import { formatTime } from "../lib/helpers.js";
import { CreateGroupModal, EditGroupModal, GroupModal } from "../components";

// --- BEGIN PLACEHOLDER ---

function getClassById(id) {
    return placeholderClasses.find(c => c.id === id);
}

function getGroupById(id) {
    return placeholderGroups.find(g => g.id === id);
}

function getSchedulesForGroup(groupId) {
    return placeholderSchedules.filter(s => s.group_id === groupId);
}
// --- END PLACEHOLDER ---


const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getScheduleString(s) {
    const formatTime = (timeStr) => {
        const [hour, minute] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(parseInt(hour), parseInt(minute));
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const day = DAYS_OF_WEEK[s.day];
    return `${day} ${formatTime(s.start_time)}-${formatTime(s.end_time)}`;
}

function StudyGroupComponent({ group, currentUserId, onView, onEdit }) {
    return (
        <li className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="font-semibold text-gray-800">{group.group_name}</p>
                <p className="text-sm text-gray-500 mt-1">{group?.day_of_week || "TBD"}, {formatTime(group?.time)}</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                    type="button"
                    onClick={() => onView?.(group)}
                    className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm text-indigo-700 rounded font-medium"
                >
                    View
                </button>
                <button
                    type="button"
                    onClick={() => onEdit?.(group)}
                    disabled={currentUserId !== group.group_owner}
                    className="bg-amber-50 hover:bg-amber-100 cursor-pointer px-3 py-1 text-sm text-amber-700 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Edit
                </button>
            </div>
        </li>
    );
}

export default function ProfileViewer() {
    const user = {
        name: "John Smith",
        major: "Computer Science",
        year: "Sophomore",
        phone: "(555) 123-4567",
        email: "jordan@example.com",
        bio: "Passionate about collaborative studying, algorithms, and building helpful tools for classmates.",
        classIds: [1, 2, 3],
        groupIds: [
            1,
            2,
            3
        ]
    };

    const userGroups = user.groupIds.map(getGroupById);
    const userClasses = user.classIds.map(getClassById);

    const [groups, setGroups] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);


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

    const handleRemoveGroup = (groupId) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
    };

    const handleOpenGroupModal = (group) => {
        setSelectedGroup(group);
    };

    const handleCloseGroupModal = () => {
        setSelectedGroup(null);
    };

    const handleCreateGroup = (createdGroup) => {
        if (!createdGroup) return;
        setGroups(prev => [createdGroup, ...prev]);
    };

    const handleOpenEditGroupModal = (group) => {
        setEditingGroup(group);
    };

    const handleCloseEditGroupModal = () => {
        setEditingGroup(null);
    };

    const handleUpdateGroup = (updatedGroup) => {
        if (!updatedGroup?.id) return;

        setGroups(prev => prev.map(group => {
            if (group.id !== updatedGroup.id) return group;
            return {
                ...group,
                ...updatedGroup,
                users: group.users || updatedGroup.users || []
            };
        }));

        setSelectedGroup(prev => {
            if (!prev || prev.id !== updatedGroup.id) return prev;
            return { ...prev, ...updatedGroup };
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="header-section">
                <Navbar />
            </header>

            {selectedGroup && (
                <GroupModal
                    group={selectedGroup}
                    onClose={handleCloseGroupModal}
                    onLeave={handleRemoveGroup}
                />
            )}

            {isCreateGroupOpen && (
                <CreateGroupModal
                    onClose={() => setIsCreateGroupOpen(false)}
                    onCreated={handleCreateGroup}
                />
            )}

            {editingGroup && (
                <EditGroupModal
                    group={editingGroup}
                    onClose={handleCloseEditGroupModal}
                    onUpdated={handleUpdateGroup}
                />
            )}

            <main className="max-w-4xl mx-auto p-6">
                <section className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-6">

                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        {user.major} • {user.year}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.location}</p>
                                </div>

                                <Link to="/profile_edit" className="px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700! rounded">
                                    Edit Profile
                                </Link>
                            </div>

                            <p className="mt-4 text-gray-700">{user.bio}</p>

                            <div className="mt-4">
                                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                                    <div className="font-medium text-gray-800">Contact</div>
                                    <div className="mt-2">Email: <span className="font-medium text-gray-800">{user.email}</span></div>
                                    <div>Phone: <span className="font-medium text-gray-800">{user.phone}</span></div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="font-bold text-gray-800">Classes</div>
                                <div className="mt-2">
                                    {userClasses.map(c => (
                                        <span key={c.id} className="inline-block mr-2 mb-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                            {c.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-medium text-gray-800">Study Groups</h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateGroupOpen(true)}
                                className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm text-indigo-700 rounded font-medium"
                            >
                                + Create Group
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Groups this user is participating in.</p>

                        {loading && (
                            <div className="rounded-lg bg-white p-8 text-center">
                                <p className="text-gray-500 text-lg">Loading your groups...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="rounded-lg border border-red-200 mt-2 bg-red-50 p-4 text-red-700 mb-4">
                                {error}
                            </div>
                        )}

                        {!loading && !error && groups.length === 0 && (
                            <div className="rounded-l mt-2 bg-white p-8 text-center">
                                <p className="text-gray-500 text-lg">You are not in any groups yet.</p>
                            </div>
                        )}

                        {!loading && !error && groups.length > 0 && (
                            <ul className="mt-4 space-y-3">
                                {groups.map((group) => (
                                    <StudyGroupComponent
                                        key={group.id}
                                        group={group}
                                        currentUserId={currentUserId}
                                        onView={handleOpenGroupModal}
                                        onEdit={handleOpenEditGroupModal}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Contact moved to top panel to keep groups list full-height */}
                    <div />
                </section>
            </main>
        </div>
    );
}