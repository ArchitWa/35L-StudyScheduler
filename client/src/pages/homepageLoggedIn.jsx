import { useEffect, useState } from 'react';
import ActionCard from '../components/actioncard.jsx';
import Navbar from "../components/navbar.jsx"
import { ProfileCreatorModal } from '../components/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchRecommendedGroups } from '../lib/api.js';
import { formatTime, normalizeClasses } from '../lib/helpers.js';
import { Link } from 'react-router-dom';

// --- Logged-in Homepage Component ---
const HomepageLoggedIn = ({ profile }) => {
  const { fetchUser } = useAuth();
  const [isProfileCreatorOpen, setIsProfileCreatorOpen] = useState(!profile?.name);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recError, setRecError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        setLoadingRecs(true);
        const groups = await fetchRecommendedGroups(3);
        if (!cancelled) {
          setRecommendations(groups);
          setRecError("");
        }
      } catch (err) {
        if (!cancelled) {
          setRecError(err.message || "Failed to load recommendations");
          setRecommendations([]);
        }
      } finally {
        if (!cancelled) setLoadingRecs(false);
      }
    }

    loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileCreated = async (createdProfile) => {
    setIsProfileCreatorOpen(false);
    await fetchUser();
  };
  if (isProfileCreatorOpen) {
    return (
      <div className="font-sans min-h-screen flex flex-col">
        <Navbar />
        <ProfileCreatorModal onCreated={handleProfileCreated} />
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Header Section (Blue) */}
      <Navbar />

      {/* Main Content Section (White/Gray) */}
      <main className="bg-[#f4f6f8] grow p-10 flex flex-col items-center">
        <div className="text-center py-10">
          <h1 className="text-3xl text-gray-700 font-bold mb-4">Welcome, {profile?.name}!</h1>
        </div>

        {/* Section 1: Recommended Partners */}
        <h2 className="text-2xl font-bold text-[#333] mb-8">Recommended Study Groups</h2>
        <div className="flex justify-center gap-5 w-full max-w-4xl mb-12 overflow-x-auto">
          {loadingRecs && (
            <div className="w-full text-center text-gray-500">Loading recommendations...</div>
          )}
          {!loadingRecs && recError && (
            <div className="w-full text-center text-red-600">{recError}</div>
          )}
          {!loadingRecs && !recError && recommendations.length === 0 && (
            <div className="w-full text-center text-gray-500">
              No recommendations yet. Add classes in your profile to improve matches.
            </div>
          )}
          {!loadingRecs && !recError && recommendations.map((group) => {
            const classList = normalizeClasses(group.classes);
            return (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="w-[350px] min-h-[280px] border-3 border-dashed border-[#b0c4de] bg-[#eaf0f6] flex flex-col justify-between items-start gap-3 text-[#5a7a9e] font-semibold rounded-lg text-left p-5 no-underline"
              >
                <div>
                  <div className="text-[#2d6cb5] text-[1.1rem] font-bold">{group.group_name}</div>
                  <div className="text-[0.85rem] text-[#6b86a6] mt-1">
                    {group.day_of_week || "TBD"} {group.time ? `• ${formatTime(group.time)}` : ""}
                  </div>
                  {group.meet_spot && (
                    <div className="text-[0.85rem] text-[#6b86a6] mt-1">At: {group.meet_spot}</div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {classList.slice(0, 3).map((cls) => (
                      <span key={cls} className="px-2 py-1 bg-white rounded text-[0.75rem] text-[#2d6cb5]">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[0.8rem] text-[#6b86a6]">
                  {group.reasons?.length > 0 ? group.reasons.join(" • ") : "Recommended for you"}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Section 2: Actions */}
        <h2 className="text-2xl font-bold text-[#333] mb-8" style={{ marginTop: '20px' }}>What would you like to do?</h2>
        <div className="flex justify-center gap-5 w-full max-w-4xl mb-12 overflow-x-auto">
          <ActionCard
            actionLabel="View Profile"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/edit--v1.png"
            url="/profile"
          />
          <ActionCard
            actionLabel="Find Group"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/search--v1.png"
            url="/groups"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-5 bg-[#f4f6f8] text-[#666] text-sm border-t border-[#e0e0e0]">
        Study Group Finder - Built with Node Express, React, and Tailwind CSS.
      </footer>
    </div>
  );
};

export default HomepageLoggedIn;
