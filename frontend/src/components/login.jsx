import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from 'lucide-react';

const AuthForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const displayErrorMessage = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = form;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          window.location.replace('/ChatInterface');
        } else {
          displayErrorMessage('Please verify your email address first.');
        }
      })
      .catch(() => displayErrorMessage('Username or password incorrect'));
  };

  const handleForgotPassword = () => {
    if (!form.email) {
      displayErrorMessage('Please enter your email to reset password.');
      return;
    }
    sendPasswordResetEmail(auth, form.email)
      .then(() => alert('Reset link sent to your email id'))
      .catch((err) => displayErrorMessage(err.message));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 flex overflow-y-auto">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-lime-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-200 to-green-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-lime-200 to-green-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full opacity-10 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-lg p-10 my-8 border border-green-100/50">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-lime-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-lime-400 to-green-400 rounded-full shadow-sm"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-lg">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50/90 backdrop-blur border border-red-200/60 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <InputField 
              id="email" 
              label="Email Address" 
              value={form.email} 
              onChange={handleChange} 
              type="email"
              placeholder="Enter your email address"
            />
            
            <InputField 
              id="password" 
              label="Password" 
              value={form.password} 
              onChange={handleChange} 
              type="password"
              placeholder="Enter your password"
            />

            <div className="text-right">
              <button 
                type="button" 
                className="text-transparent bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text hover:from-green-800 hover:to-lime-800 font-semibold transition-all duration-200 text-sm"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 via-lime-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:via-lime-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Sign In 🌿
            </button>

            <div className="text-center pt-6">
              <p className="text-gray-600">
                Don't have an account?{'sign '}
                <a href="/sign" className="text-transparent bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text hover:from-green-800 hover:to-lime-800 font-semibold transition-all duration-200">
                  Sign Up →
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Enhanced input component with olive green theme
const InputField = ({ label, id, value, onChange, type = 'text', placeholder }) => (
  <div className="group">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-700 transition-colors duration-200">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-green-50/30 hover:bg-white hover:border-green-300"
    />
  </div>
);

export default AuthForm;