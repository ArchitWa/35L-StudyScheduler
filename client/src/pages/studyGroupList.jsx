import { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import GroupCard from "../components/groupcard.jsx";

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_URL}/api/study-groups`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch groups: ${response.statusText}`);
                }

                const data = await response.json();
                setGroups(data.groups || []);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching groups:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleLoadMore = () => {
        setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
    };

    const visibleGroups = groups.slice(0, displayedCount);
    const hasMore = displayedCount < groups.length;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="header-section">
                <Navbar onToggleLogin={true} />
            </header>

            <main className="max-w-4xl mx-auto p-6">
                <section className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
                    <p className="text-gray-600">Discover and join study groups for your classes</p>
                </section>

                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Loading study groups...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-700">Error loading groups: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="space-y-4 mb-8">
                            {visibleGroups.map((group) => (
                                <GroupCard key={group.id} group={group} />
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
                    </>
                )}
            </main>
        </div>
    );
}