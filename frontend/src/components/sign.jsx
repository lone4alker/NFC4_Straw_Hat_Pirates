import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from './firebase'; // adjust path as needed

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    industry: '',
    password: '',
    redditUrl: '',
    youtubeUrl: '',
    xUrl: '',
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

  const clearErrorMessage = () => setError('');

  const displayErrorMessage = (msg) => {
    setError(msg);
    setTimeout(clearErrorMessage, 5000);
  };

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setForm({ ...form, [id || name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, role, industry, redditUrl, youtubeUrl, xUrl } = form;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      await sendEmailVerification(user);

      console.log('Saving user to DB:', {
        name, email, role, industry, redditUrl, youtubeUrl, xUrl, uid: userId,
      });

      const database = getDatabase();
      await set(ref(database, 'users/' + userId), {
        name,
        email,
        role,
        industry,
        platforms: {
          reddit: redditUrl,
          youtube: youtubeUrl,
          x: xUrl,
        },
        uid: userId,
      });

      console.log('User successfully saved!');
      alert('Verification email sent!');
      window.location.replace('/login.html');
    } catch (err) {
      console.error(err);
      displayErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 flex overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-300 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-10 animate-bounce"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-lg p-10 my-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Join Our Community
            </h2>
            <p className="text-gray-600 text-lg">Create your account and get started</p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur border border-red-200/50 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm">
              {error}
            </div>
          )}

                      <form onSubmit={handleSubmit} className="space-y-5 max-h-96 overflow-y-auto pr-2">
            <InputField 
              label="Full Name" 
              id="name" 
              value={form.name} 
              onChange={handleChange}
              placeholder="Enter your full name" 
            />
            
            <InputField 
              label="Email Address" 
              id="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange}
              placeholder="Enter your email" 
            />
            
            <InputField 
              label="Role/Position" 
              id="role" 
              value={form.role} 
              onChange={handleChange} 
              placeholder="e.g., Data Scientist, Student, Manager" 
            />
            
            <InputField 
              label="Industry" 
              id="industry" 
              value={form.industry} 
              onChange={handleChange}
              placeholder="e.g., Technology, Healthcare, Education" 
            />
            
            <InputField 
              label="Password" 
              id="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange}
              placeholder="Create a strong password" 
            />

            {/* Social Media URLs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent border-b border-gradient-to-r from-violet-200 to-purple-200 pb-2">
                Social Media Profiles (Optional)
              </h3>
              
              <InputField 
                label="Reddit Profile URL" 
                id="redditUrl" 
                value={form.redditUrl} 
                onChange={handleChange}
                placeholder="https://reddit.com/u/username" 
                icon="🟠"
              />
              
              <InputField 
                label="YouTube Channel URL" 
                id="youtubeUrl" 
                value={form.youtubeUrl} 
                onChange={handleChange}
                placeholder="https://youtube.com/@username" 
                icon="🔴"
              />
              
              <InputField 
                label="X (Twitter) Profile URL" 
                id="xUrl" 
                value={form.xUrl} 
                onChange={handleChange}
                placeholder="https://x.com/username" 
                icon="⚫"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Create Account ✨
            </button>

            <div className="text-center pt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text hover:from-violet-700 hover:to-purple-700 font-semibold transition-all duration-200">
                  Sign In →
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Enhanced input component with modern styling
const InputField = ({ label, id, value, onChange, type = 'text', placeholder, icon }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-violet-600 transition-colors duration-200">
      {icon && <span className="mr-2 text-lg">{icon}</span>}
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={!['redditUrl', 'youtubeUrl', 'xUrl'].includes(id)}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
    />
  </div>
);

export default SignUp;