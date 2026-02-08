import React, { useState } from 'react';
import HomepageLoggedIn from './homepageLoggedIn.jsx';
import HomepageLoggedOut from './homepageLoggedOut.jsx';

// --- Main Homepage Component (switcher) ---
const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleToggleLogin = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return isLoggedIn ? (
    <HomepageLoggedIn onToggleLogin={handleToggleLogin} />
  ) : (
    <HomepageLoggedOut onToggleLogin={handleToggleLogin} />
  );
};

export default Homepage;