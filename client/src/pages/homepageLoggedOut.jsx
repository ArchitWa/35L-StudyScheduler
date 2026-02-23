// --- Logged-out Homepage Component ---
const HomepageLoggedOut = ({ onToggleLogin }) => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Header Section (Blue) */}
      <header className="bg-gradient-to-br from-[#1a4a8f] to-[#2d6cb5] text-white pb-[60px]">
        <nav className="flex justify-between items-center px-10 py-5">
          <div className="text-xl font-semibold">StudyScheduler</div>
          <div className="flex items-center gap-[30px]">
            <button type="button" onClick={onToggleLogin} 
            className="!bg-transparent border border-white text-white text-[0.9rem] font-semibold px-6 py-2 rounded cursor-pointer hover:bg-white/10 transition-colors">
            Log In
            </button>
          </div>
        </nav>

        <div className="text-center py-10 px-5">
          <h1 className="text-[2.5rem] font-bold mb-4">Welcome to StudyScheduler!</h1>
          <div className="text-[1.1rem] leading-[1.6] text-white/90 max-w-[700px] mx-auto mb-[30px]">
            <p>Connect with classmates. Find your study times. Ace your classes together.</p>
            <p>It has become difficult to find students with similar classes and schedules.</p>
            <p>Our goal is to make it easy for you to create and join study groups.</p>
          </div>
        </div>
      </header>

      <main className="bg-[#f4f6f8] flex-grow p-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-[#333] mb-[30px] text-center">Why StudyScheduler?</h2>
        <div className="flex justify-center gap-5 w-full max-w-[1200px] mb-[50px] flex-nowrap overflow-x-auto">
          <div className="w-[400px] h-[220px] border-[3px] border-dashed border-[#b0c4de] bg-[#eaf0f6] flex justify-center items-center text-[#5a7a9e] font-semibold rounded-lg text-center p-6 text-lg">Don't study alone. Connect with classmates in your specific courses and sections to form high-impact study groups that actually get work done.</div>
          <div className="w-[400px] h-[220px] border-[3px] border-dashed border-[#b0c4de] bg-[#eaf0f6] flex justify-center items-center text-[#5a7a9e] font-semibold rounded-lg text-center p-6 text-lg">Skip the back-and-forth emails. Our smart scheduling tool automatically finds the gaps in everyone's calendar to suggest perfect meeting times.</div>
          <div className="w-[400px] h-[220px] border-[3px] border-dashed border-[#b0c4de] bg-[#eaf0f6] flex justify-center items-center text-[#5a7a9e] font-semibold rounded-lg text-center p-6 text-lg">Create lasting academic circles. Join existing groups or start your own to share resources, clarify difficult concepts, and ace your finals together.</div>
        </div>
      </main>

      <footer className="text-center p-5 bg-[#f4f6f8] text-[#666] text-[0.8rem] border-t border-[#e0e0e0]">
        Study Group Finder - Built with Node Express, React, and Tailwind CSS.
      </footer>
    </div>
  );
};

export default HomepageLoggedOut;
