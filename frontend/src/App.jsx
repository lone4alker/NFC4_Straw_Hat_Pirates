import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import LandingPage from './components/land'; // Make sure this is the correct path
import SignUp from './components/sign';
import AuthForm from './components/login';
=======
import ChatInterface from './ChatInterface';
import SignUp from './components/sign'; // Create this file if not already
import AuthForm from './components/login'; // Create this file if not already
import Header from './components/Header'; // Optional: if using a Header with a Signup button
import ClauseTemplates from './components/templ';
import './App.css';
>>>>>>> 99d31c6b45e3b4559ec1d420bc3eedcc014392e0

function App() {
  return (
    <Router>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
      {/* Optional Header */}
    

>>>>>>> 7fa6f9cd2a3f0168303ec56f05743184fbda3ff8
      {/* Routes */}
>>>>>>> 99d31c6b45e3b4559ec1d420bc3eedcc014392e0
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/sign" element={<SignUp/>} />

        <Route path="/login" element={<AuthForm />} />
        <Route path="/templates" element={<ClauseTemplates />} />
      </Routes>
    </Router>
  );
}

export default App;
