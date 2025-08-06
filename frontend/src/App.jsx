import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import CloutCraftApp from './tp';
import LandingPage from './components/land'; // Adjust path if needed
import SignUp from './components/sign'; // Your SignUp component
import AuthForm from './components/login'; // Your AuthForm component
import Profile from './components/profile'; // Corrected import and naming convention

import './App.css'; // Your global CSS file

function App() {
  return (
    <Router>
      {/* Optional Header or other layout components can go here */}

      {/* Routes */}
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Signup page for full details */}
        <Route path="/sign" element={<SignUp />} />

        {/* Login page */}
        <Route path="/login" element={<AuthForm />} />

        {/* Main application content */}
        <Route path="/CloutCraft" element={<CloutCraftApp />} />

        {/* Profile page */}
        <Route path="/profile" element={<Profile />} />

        {/* Add any other specific routes here */}
      </Routes>
    </Router>
  );
}

export default App;
