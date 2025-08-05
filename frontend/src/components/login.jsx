import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase'; // make sure this exports 'auth' from Firebase
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // login or signup
  const navigate = useNavigate();

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

  const displayError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      if (userCredential.user.emailVerified) {
        navigate('/CloutCraft');
      } else {
        displayError('Please verify your email address first.');
      }
    } catch {
      displayError('Username or password incorrect.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await sendEmailVerification(userCredential.user);
      alert('Account created. Please check your email for verification.');
      navigate('/CloutCraft');
    } catch (err) {
      displayError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      displayError('Please enter your email to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      alert('Reset link sent to your email id.');
    } catch (err) {
      displayError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-lime-50 relative overflow-hidden">
      {/* Background bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-green-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-lime-200 rounded-full opacity-10 animate-bounce" />
      </div>

      <div className="z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text text-transparent">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm">{mode === 'login' ? 'Sign in to continue' : 'Sign up to get started'}</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
          <InputField
            id="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="you@example.com"
          />
          <InputField
            id="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
          />

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-green-600 text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 text-white py-3 rounded-xl font-semibold shadow hover:from-green-700 hover:to-lime-700 transition"
          >
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-green-700 font-semibold hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, id, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
    />
  </div>
);

export default AuthForm;