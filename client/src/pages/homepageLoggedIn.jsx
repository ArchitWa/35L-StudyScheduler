import { useState } from 'react';
import PartnerCard from '../components/partnercard.jsx';
import ActionCard from '../components/actioncard.jsx';
import Navbar from "../components/navbar.jsx"
import { ProfileCreatorModal } from '../components/index.js';
import { useAuth } from '../context/AuthContext.jsx';

// --- Logged-in Homepage Component ---
const HomepageLoggedIn = ({ profile }) => {
  const { fetchUser } = useAuth();
  const [isProfileCreatorOpen, setIsProfileCreatorOpen] = useState(!profile.name);

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
        <h2 className="text-2xl font-bold text-[#333] mb-8">Recommended Study Partners</h2>
        <div className="flex justify-center gap-5 w-full max-w-4xl mb-12 overflow-x-auto">
          <PartnerCard
            firstName="Alex"
            lastInitial="M"
            profileImageUrl="https://i.pravatar.cc/150?img=32"
            onNameClick={() => window.alert("Alex's profile page isn't implemented yet.")}
          />
          <PartnerCard
            firstName="Maria"
            lastInitial="S"
            profileImageUrl="https://i.pravatar.cc/150?img=49"
            onNameClick={() => window.alert("Maria's profile page isn't implemented yet.")}
          />
          <PartnerCard
            firstName="David"
            lastInitial="K"
            profileImageUrl="https://i.pravatar.cc/150?img=12"
            onNameClick={() => window.alert("David's profile page isn't implemented yet.")}
          />
        </div>

        {/* Section 2: Actions */}
        <h2 className="text-2xl font-bold text-[#333] mb-8" style={{ marginTop: '20px' }}>What would you like to do?</h2>
        <div className="flex justify-center gap-5 w-full max-w-4xl mb-12 overflow-x-auto">
          <ActionCard
            actionLabel="Edit Profile"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/edit--v1.png"
            url="/profile_edit"
          />
          <ActionCard
            actionLabel="Find Group"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/search--v1.png"
            url="/groups"
          />
          <ActionCard
            actionLabel="Create Group"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/plus-math.png"
            url="/create-group"
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
