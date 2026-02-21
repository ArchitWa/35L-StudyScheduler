import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Homepage from './pages/homepage.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import ProfileViewer from './pages/profileViewer.jsx'
import ProfileEditor from './pages/profileEditor.jsx'
import GroupList from "./pages/studyGroupList.jsx"
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<ProfileViewer />} />
          <Route path="/profile_edit" element={<ProfileEditor />} />
          <Route path="/groups" element={<GroupList />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/
