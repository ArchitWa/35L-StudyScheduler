import { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import GroupCard from "../components/groupcard.jsx";
import { CreateGroupModal } from "../components/";
import { fetchStudyGroups, getUser } from "../lib/api.js";

const ITEMS_PER_PAGE = 10;

export default function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const fetchedGroups = await fetchStudyGroups();
                setGroups(fetchedGroups);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
        getUser().then(user => setCurrentUserId(user || null))
            .catch(err => console.error("Error fetching user info:", err));
    }, []);

    const handleLoadMore = () => {
        setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
    };

    const handleCreateGroup = (createdGroup) => {
        if (!createdGroup) return;
        setGroups(prev => [createdGroup, ...prev]);
        setDisplayedCount(prev => prev + 1);
    };

    const visibleGroups = groups.slice(0, displayedCount);
    const hasMore = displayedCount < groups.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="header-section">
                    <Navbar />
                </header>
                <main className="max-w-4xl mx-auto p-6">
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Loading groups...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="header-section">
                    <Navbar />
                </header>
                <main className="max-w-4xl mx-auto p-6">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">Error: {error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="header-section">
                <Navbar />
            </header>

            {isCreateGroupOpen && (
                <CreateGroupModal
                    onClose={() => setIsCreateGroupOpen(false)}
                    onCreated={handleCreateGroup}
                />
            )}

            <main className="max-w-4xl mx-auto p-6">
                <section className="mb-8">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
                        <button
                            type="button"
                            onClick={() => setIsCreateGroupOpen(true)}
                            className="mr-20 bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm text-indigo-700 rounded font-medium"
                        >
                            + Create Group
                        </button>
                    </div>
                    <p className="text-gray-600">Discover and join study groups for your classes</p>
                </section>

                <div className="space-y-4 mb-8">
                    {visibleGroups.map((group) => (
                        <GroupCard key={group.id} group={group} currentUserId={currentUserId} />
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm  text-indigo-700 rounded font-medium"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {visibleGroups.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No groups found</p>
                    </div>
                )}
            </main>
        </div>
    );
}