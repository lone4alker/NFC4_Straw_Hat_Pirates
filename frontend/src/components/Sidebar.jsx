import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  BarChart3,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Settings
} from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from './firebase.js'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const icons = {
  BarChart3,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Settings
};

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeView, setActiveView, handleNewChat, navItems }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const database = getDatabase(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userName = user.displayName;
        // --- DEBUG LOG: Check Firebase Auth displayName ---
        console.log("DEBUG: Firebase Auth displayName:", userName);

        // If displayName is null, try to fetch it from Realtime Database
        if (!userName) {
          try {
            const userRef = ref(database, 'users/' + user.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              const dbData = snapshot.val();
              const dbName = dbData.name; // Get name from Realtime Database
              // --- DEBUG LOG: Check Realtime Database name ---
              console.log("DEBUG: Realtime Database name:", dbName);
              userName = dbName;
            } else {
              // --- DEBUG LOG: No user data in DB ---
              console.log("DEBUG: No user data found in Realtime Database for UID:", user.uid);
            }
          } catch (error) {
            console.error("ERROR: Error fetching user name from Realtime Database:", error);
          }
        }

        setUserInfo({
          name: userName || 'Guest', // Use fetched name or default to 'Guest'
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        // User is signed out.
        setUserInfo(null);
        console.log("DEBUG: User is signed out.");
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const userInitials = userInfo?.name
    ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'G';

  const handleProfileClick = () => {
    if (userInfo) {
      // --- CORRECTED LINE: Navigate to the route path, not the file name ---
      navigate('/profile'); // Changed from '/profile.jsx' to '/profile'
    }
  };

  if (!isAuthReady) {
    return (
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}>
        <div className="p-6 h-full flex flex-col items-center justify-center text-gray-500">
          Loading user info...
        </div>
      </div>
    );
  }

  return (
    <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}>
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CloutCraft</span>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold mb-6 transition-colors"
        >
          + New Chat
        </button>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = icons[item.icon];
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            disabled={!userInfo}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              {userInitials}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {userInfo?.name || 'Guest'}
              </div>
              <div className="text-sm text-gray-500">Pro Member</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
