import { useAuth } from '../context/AuthContext.jsx';
import HomepageLoggedIn from './homepageLoggedIn.jsx';
import HomepageLoggedOut from './homepageLoggedOut.jsx';

// --- Main Homepage Component (switcher) ---
const Homepage = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <HomepageLoggedIn /> : <HomepageLoggedOut />;
};

export default Homepage;