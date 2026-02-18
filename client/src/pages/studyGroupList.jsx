import { useState } from "react";
import Navbar from "../components/navbar.jsx";
import GroupCard from "../components/groupcard.jsx";
import { placeholderGroups } from "./placeholders.jsx";

const ITEMS_PER_PAGE = 10;

export default function GroupList() {
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

    const handleLoadMore = () => {
        setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
    };

    const visibleGroups = placeholderGroups.slice(0, displayedCount);
    const hasMore = displayedCount < placeholderGroups.length;

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

                <div className="space-y-4 mb-8">
                    {visibleGroups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-indigo-700 font-medium rounded-lg transition-colors"
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