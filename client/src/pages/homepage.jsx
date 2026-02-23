import { useState } from 'react';
import HomepageLoggedIn from './homepageLoggedIn.jsx';
import HomepageLoggedOut from './homepageLoggedOut.jsx';

const Homepage = () => {
  const { isLoggedIn, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="homepage-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading…</p>
      </div>
    );
  }

  return isLoggedIn ? (
    <HomepageLoggedIn onToggleLogin={logout} />
  ) : (
    <HomepageLoggedOut />
  );
};

export default Homepage;