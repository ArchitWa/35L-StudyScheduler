import React from 'react';
import './Homepage.css';

// --- Helper Component for Unknown Implementations ---
const PlaceholderComponent = ({ label, width, height }) => (
  <div 
    className="placeholder-component" 
    style={{ width: width, height: height }}
  >
    {label} Component Implementation Needed
  </div>
);

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
          <PlaceholderComponent label="Partner Card (Alex)" width="350px" height="280px" />
          <PlaceholderComponent label="Partner Card (Maria)" width="350px" height="280px" />
          <PlaceholderComponent label="Partner Card (David)" width="350px" height="280px" />
        </div>

        {/* Section 2: Actions */}
        <h2 className="section-title" style={{ marginTop: '20px' }}>What would you like to do?</h2>
        <div className="cards-container">
          <PlaceholderComponent label="Action Card (Edit Profile)" width="350px" height="180px" />
          <PlaceholderComponent label="Action Card (Find Group)" width="350px" height="180px" />
          <PlaceholderComponent label="Action Card (Create Group)" width="350px" height="180px" />
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