import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/land'; // Adjust path if needed
import SignUp from './components/sign';
import AuthForm from './components/login';
import ClauseTemplates from './components/templ'; // Make sure this exists

function App() {
  return (
    <Router>
<<<<<<< HEAD
=======
      {/* Optional Header */}
    

>>>>>>> 7fa6f9cd2a3f0168303ec56f05743184fbda3ff8
      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/templates" element={<ClauseTemplates />} />
      </Routes>
    </Router>
  );
}

export default App;