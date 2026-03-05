import { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import GroupCard from "../components/groupcard.jsx";
import { fetchStudyGroups } from "../lib/api.js";

const ITEMS_PER_PAGE = 10;

export default function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const fetchedGroups = await fetchStudyGroups();
                // Map backend data to frontend format
                const mappedGroups = fetchedGroups.map(group => ({
                    id: group.id,
                    title: group.group_name,
                    description: group.goals,
                    meeting_link: group.meet_spot,
                    schedule_ids: [{
                        day: group.day_of_week,
                        start_time: group.time,
                    }],
                    class_ids: group.classes || [],
                }));
                setGroups(mappedGroups);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    const handleLoadMore = () => {
        setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
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

            <main className="max-w-4xl mx-auto p-6">
                <section className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
                    <p className="text-gray-600">Discover and join study groups for your classes</p>
                </section>

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
            </main>
        </div>
    );
}