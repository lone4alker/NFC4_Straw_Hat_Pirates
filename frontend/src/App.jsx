import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import SignUp from './components/sign'; // Create this file if not already
import AuthForm from './components/login'; // Create this file if not already
import Header from './components/Header'; // Optional: if using a Header with a Signup button
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Only needed if using Header

  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<AuthForm />} />

      </Routes>
    </Router>
  );
}

export default App;
