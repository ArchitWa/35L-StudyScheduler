import { useAuth } from '../context/AuthContext.jsx';
import HomepageLoggedIn from './homepageLoggedIn.jsx';
import HomepageLoggedOut from './homepageLoggedOut.jsx';

// --- Main Homepage Component (switcher) ---
const Homepage = () => {
  const { isLoggedIn, loading, profile } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isLoggedIn ? <HomepageLoggedIn profile={profile} /> : <HomepageLoggedOut />;
};

export default Homepage;