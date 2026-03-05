import Navbar from "../components/navbar.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "../lib/api.js";
import { formatTime } from "../lib/helpers.js";
import { GroupModal, CreateGroupModal, EditGroupModal, ProfileEditorModal, ClassPill } from "../components/";
import { useAuth } from "../context/AuthContext.jsx";

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
    const { isLoggedIn, loadingProfile, profile } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);


    useEffect(() => {
        const controller = new AbortController();

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

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="rounded-lg bg-white p-8 text-center">
                    <p className="text-gray-500 text-lg">
                        You must be <Link to="/login" className="text-blue-500 underline">logged in</Link> to view this page.
                    </p>
                </main>
            </div>
        );
    }


    if (loading || loadingProfile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="header-section">
                    <Navbar />
                </header>
                <main className="rounded-lg bg-white p-8 text-center">
                    <p className="text-gray-500 text-lg">Loading your profile...</p>
                </main>
            </div>
        );
    }

    const user = {
        name: profile.name || "No Name",
        major: profile.major || "No Major",
        year: profile.year || "No Year",
        phone: profile.phone_number || "No Phone Number",
        email: profile.email || "No Email",
        bio: profile.bio || "No Bio",
        classes: Array.isArray(profile.classes_taking) ? profile.classes_taking : [],
    };

    const userClasses = user.classes;


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

    const handleProfileUpdated = (updatedProfile) => {
        // The profile will be updated via the AuthContext fetchUser
        // but we can also update it locally if needed
        console.log("Profile updated:", updatedProfile);
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

            {isProfileEditorOpen && (
                <ProfileEditorModal
                    onClose={() => setIsProfileEditorOpen(false)}
                    onUpdated={handleProfileUpdated}
                    initialProfile={{
                        name: profile.name,
                        major: profile.major,
                        year: profile.year,
                        phone: profile.phone_number,
                        bio: profile.bio,
                        classes: profile.classes_taking || []
                    }}
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

                                <button
                                    onClick={() => setIsProfileEditorOpen(true)}
                                    className="px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded cursor-pointer"
                                >
                                    Edit Profile
                                </button>
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
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {userClasses.length === 0 ?
                                        <div className="text-gray-500 text-sm"> No Classes Found </div>
                                        : userClasses.map((c, i) => (
                                            <ClassPill key={i} value={c} />
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
                                        currentUserId={profile.id}
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