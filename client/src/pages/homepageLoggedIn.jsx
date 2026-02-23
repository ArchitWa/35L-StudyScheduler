import PartnerCard from '../components/partnercard.jsx';
import ActionCard from '../components/actioncard.jsx';

// --- Logged-in Homepage Component ---
const HomepageLoggedIn = ({ onToggleLogin }) => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Header Section (Blue) */}
      <header className="bg-gradient-to-br from-[#1a4a8f] to-[#2d6cb5] text-white pb-[30px]">
        <nav className="flex justify-between items-center px-10 py-5">
          <div className="text-xl font-semibold">StudyScheduler</div>
          <div className="flex items-center gap-[30px]">
            <a href="#" className="!text-white border-b-2 border-white pb-1 opacity-100">Home</a>
            <a href="#" className="!text-white text-base font-medium no-underline cursor-pointer transition-opacity hover:opacity-80">My Profile & Schedule</a>
            <a href="#" className="!text-white text-base font-medium no-underline cursor-pointer transition-opacity hover:opacity-80">Find Groups</a>
            <button type="button" className="user-toggle" onClick={onToggleLogin}>
              <span className="!text-white font-medium user-name">[User Name]</span>
              <div className="user-icon"></div>
            </button>
          </div>
        </nav>

        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-4">Welcome, [User Name]!</h1>
        </div>
      </header>

      {/* Main Content Section (White/Gray) */}
      <main className="bg-[#f4f6f8] flex-grow p-10 flex flex-col items-center">
        
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
            onAction={() => window.alert("Edit Profile isn't implemented yet.")}
          />
          <ActionCard
            actionLabel="Find Group"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/search--v1.png"
            onAction={() => window.alert("Find Group isn't implemented yet.")}
          />
          <ActionCard
            actionLabel="Create Group"
            iconUrl="https://img.icons8.com/ios-filled/100/2d6cb5/plus-math.png"
            onAction={() => window.alert("Create Group isn't implemented yet.")}
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
