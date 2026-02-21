import React from 'react';
import { Link } from 'react-router-dom';
import './homepageLoggedOut.css';

const HomepageLoggedOut = () => {
  return (
    <div className="homepage-container">
      <header className="header-section">
        <nav className="nav-bar">
          <div className="brand-title">StudyScheduler</div>
          <div className="nav-links">
            <Link to="/login" className="user-toggle" style={{ textDecoration: 'none' }}>
              <span className="user-label">Log In</span>
              <div className="user-icon"></div>
            </Link>
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
