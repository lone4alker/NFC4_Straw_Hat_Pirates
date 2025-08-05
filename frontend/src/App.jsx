import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CloutCraftApp from './tp';
import LandingPage from './components/land'; // Adjust path if needed
import SignUp from './components/sign';
import AuthForm from './components/login';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Only needed if using Header

  return (
    <Router>
      {/* Optional Header */}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/CloutCraft" element={<CloutCraftApp/>} />

      </Routes>
    </Router>
  );
}

export default App;
