import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Zap,
  FileText,
  Palette,
  Calendar,
  ChevronDown,
  Loader2,
  CheckCircle, // Added for success icon
  XCircle,      // Added for error icon
} from 'lucide-react';

// --- Firebase Imports ---
// Make sure the path to your firebase config is correct
import { app } from './firebase'; 
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

export default function Dashboard({ setActiveView }) {
  const templates = [
    { title: 'LinkedIn Post', type: 'Professional', color: 'bg-emerald-500' },
    { title: 'Twitter Thread', type: 'Engaging', color: 'bg-green-600' },
    { title: 'Startup Update', type: 'Business', color: 'bg-teal-600' },
  ];

  const tones = [
    { name: 'Professional', description: 'Formal and business-focused', icon: '💼' },
    { name: 'Casual', description: 'Friendly and conversational', icon: '😊' },
    { name: 'Inspiring', description: 'Motivational and uplifting', icon: '🚀' },
    { name: 'Educational', description: 'Informative and teaching', icon: '🎓' }
  ];

  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  // --- New State for handling feedback ---
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  /**
   * Fetches platform URL from Firebase for the current user and sends it to a backend endpoint.
   * @param {string} platform - The platform to fetch details for (e.g., 'Youtube', 'X', 'Reddit').
   */
  const handleFetchDetails = async (platform) => {
    setSelectedPlatform(platform);
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setShowPlatformDropdown(false); // Close dropdown after selection

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in to perform this action.');
      setIsLoading(false);
      // We need to show the modal to display the error, so we briefly set isLoading to true again
      setTimeout(() => setIsLoading(true), 10);
      setTimeout(() => setIsLoading(false), 3000); // Hide after 3 seconds
      return;
    }

    try {
      // 1. Fetch the platform URL from Firebase Realtime Database
      const database = getDatabase(app);
      const platformKey = platform.toLowerCase(); // 'Youtube' -> 'youtube'
      const userPlatformRef = ref(database, `users/${user.uid}/platforms/${platformKey}`);
      
      const snapshot = await get(userPlatformRef);

      if (!snapshot.exists() || !snapshot.val() || snapshot.val() === 'N/A') {
        throw new Error(`Your ${platform} URL is not set in your profile. Please add it first.`);
      }
      
      const platformUrl = snapshot.val();
      console.log(`Fetched URL for ${platform}: ${platformUrl}`);

      // 2. Send the URL to your backend
      // !!! IMPORTANT: Replace this with your actual backend API endpoint !!!
      //const backendUrl = 'https://your-backend-api.com/process-url'; 

      // AFTER (The correct address for your local server)
      const backendUrl = 'http://127.0.0.1:8000/process-url';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If your backend is secured, you might need to send an auth token
          // 'Authorization': `Bearer ${await user.getIdToken()}` 
        },
        body: JSON.stringify({
          userId: user.uid,
          platform: platformKey,
          url: platformUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to communicate with the server.' }));
        throw new Error(`Backend Error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('Backend Response:', result);
      setSuccessMessage(`Successfully fetched and processed ${platform} details!`);

    } catch (err) {
      console.error("Error in handleFetchDetails:", err);
      setError(err.message);
    } finally {
      // Keep the modal open for 3 seconds to allow the user to read the message
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto h-full font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 text-lg">Ready to create amazing AI-powered content?</p>
        </div>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setActiveView('collaboration')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
          >
            <Users className="w-5 h-5" />
            Collaborate
          </button>

          <div className="relative">
            <button
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
            >
              Fetch Details
              <ChevronDown className={`w-5 h-5 transition-transform ${showPlatformDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showPlatformDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={() => handleFetchDetails('X')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  X
                </button>
                <button
                  onClick={() => handleFetchDetails('Youtube')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Youtube
                </button>
                <button
                  onClick={() => handleFetchDetails('Reddit')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Reddit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Enhanced Loading/Feedback Modal --- */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center min-w-[300px] text-center">
            {error ? (
              <>
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-semibold text-gray-800">An Error Occurred</p>
                <p className="text-gray-600 mt-2 max-w-sm">{error}</p>
              </>
            ) : successMessage ? (
               <>
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                <p className="text-xl font-semibold text-gray-800">Success!</p>
                <p className="text-gray-600 mt-2">{successMessage}</p>
              </>
            ) : (
              <>
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-xl font-semibold text-gray-800">Fetching details for {selectedPlatform}...</p>
                <p className="text-gray-600 mt-2">This might take a moment.</p>
              </>
            )}
          </div>
        </div>
      )}
      <div
        onClick={() => setActiveView('conversations')}
        className="bg-white rounded-xl p-10 mb-10 border border-gray-200 cursor-pointer hover:border-emerald-500 transition-colors shadow-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500 rounded-lg px-6 py-2 mb-4 text-white shadow-md">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Create Your Next Content</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our templates, set your tone, and let AI craft personalized content that resonates with your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 hover:border-emerald-500 transition-colors shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Templates</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('templates');
                }}
                className="text-emerald-500 hover:text-emerald-400 text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <p className="text-gray-600 mb-4">Choose from proven formats that drive engagement</p>
            <div className="space-y-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView('templates');
                  }}
                  className="w-full flex items-center gap-2 text-sm hover:bg-gray-200 p-2 rounded-lg transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${template.color}`}></div>
                  <span>{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Tone Analyzer</h3>
            </div>
            <p className="text-gray-600 mb-4">AI learns your voice for authentic content</p>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((tone, index) => (
                <div key={index} className="text-center p-2 bg-gray-200 rounded-lg shadow-sm">
                  <div className="text-lg mb-1">{tone.icon}</div>
                  <div className="text-xs font-medium text-gray-800">{tone.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">LinkedIn Post Created</h4>
              <p className="text-sm text-gray-500">Generated professional content about AI trends</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Team Collaboration</h4>
              <p className="text-sm text-gray-500">Sarah added feedback to your Twitter thread draft</p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Content Scheduled</h4>
              <p className="text-sm text-gray-500">5 posts scheduled for next week across platforms</p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}