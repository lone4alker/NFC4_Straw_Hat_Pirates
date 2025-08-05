import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/land'; // Make sure this is the correct path
import SignUp from './components/sign';
import AuthForm from './components/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/sign" element={<SignUp/>} />

        <Route path="/login" element={<AuthForm />} />

      </Routes>
    </Router>
  );
}

export default App;
