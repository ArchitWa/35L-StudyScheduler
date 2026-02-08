import React from 'react';
import './Homepage.css';
import PartnerCard from '../components/partnercard.jsx';
import ActionCard from '../components/actioncard.jsx';

// --- Main Homepage Component ---
const Homepage = () => {
  return (
    <div className="homepage-container">
      {/* Header Section (Blue) */}
      <header className="header-section">
        <nav className="nav-bar">
          <div className="brand-title">Study Group Finder</div>
          <div className="nav-links">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">My Profile & Schedule</a>
            <a href="#" className="nav-link">Find Groups</a>
            <a href="#" className="nav-link">Notifications</a>
            <div className="user-icon"></div>
          </div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">Welcome, [User Name]!</h1>
          <div className="hero-text">
            <p>Connect with classmates. Find your study times. Ace your classes together.</p>
            <p>It has become difficult to find students with similar classes and schedules.</p>
            <p>Our goal is to make it easy for you to create and join study groups.</p>
          </div>
          <button className="get-started-btn">Get Started</button>
        </div>
      </header>

      {/* Main Content Section (White/Gray) */}
      <main className="main-content">
        
        {/* Section 1: Recommended Partners */}
        <h2 className="section-title">Recommended Study Partners</h2>
        <div className="cards-container">
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
        <h2 className="section-title" style={{ marginTop: '20px' }}>What would you like to do?</h2>
        <div className="cards-container">
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
      <footer className="footer">
        Study Group Finder - Built with Node Express, React, and Tailwind CSS.
      </footer>
    </div>
  );
};

export default Homepage;