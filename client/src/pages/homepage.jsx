import { useAuth } from '../context/AuthContext.jsx';
import HomepageLoggedIn from './homepageLoggedIn.jsx';
import HomepageLoggedOut from './homepageLoggedOut.jsx';
import singleGroupPage from './singleGroupPage.jsx';

// --- Main Homepage Component (switcher) ---
const Homepage = () => {
  const { isLoggedIn, profile } = useAuth();

  return isLoggedIn ? <HomepageLoggedIn profile={profile} /> : <HomepageLoggedOut />;
};

export default Homepage;