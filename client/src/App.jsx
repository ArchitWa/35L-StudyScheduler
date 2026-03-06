import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/homepage.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import ProfileViewer from './pages/profileViewer.jsx'
import ProfileEditor from './pages/profileEditor.jsx'
import GroupList from "./pages/studyGroupList.jsx"
import Login from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"
import GroupViewer from './pages/GroupViewer.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/profile" element={<ProfileViewer />} />
        <Route path="/profile_edit" element={<ProfileEditor />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/groups/:id" element={<GroupViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
