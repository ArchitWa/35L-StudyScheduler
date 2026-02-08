import React from 'react';
import './homepageLoggedOut.css';

// --- Logged-out Homepage Component ---
const HomepageLoggedOut = ({ onToggleLogin }) => {
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
            <button type="button" className="user-toggle" onClick={onToggleLogin}>
              <span className="user-label">Log In</span>
              <div className="user-icon"></div>
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">Welcome to StudyScheduler!</h1>
          <div className="hero-text">
            <p>Connect with classmates. Find your study times. Ace your classes together.</p>
            <p>It has become difficult to find students with similar classes and schedules.</p>
            <p>Our goal is to make it easy for you to create and join study groups.</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h2 className="section-title">Why StudyScheduler?</h2>
        <div className="cards-container">
          <div className="info-tile">Sample text about finding study partners.</div>
          <div className="info-tile">Sample text about matching schedules.</div>
          <div className="info-tile">Sample text about building study groups.</div>
        </div>
      </main>

      <footer className="footer">
        Study Group Finder - Built with Node Express, React, and Tailwind CSS.
      </footer>
    </div>
  );
};

export default HomepageLoggedOut;
