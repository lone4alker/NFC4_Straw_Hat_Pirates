import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, updateProfile as updateFirebaseAuthProfile } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database'; // Import 'set' for updating
import { app } from './firebase.js'; // Ensure this path is correct for your Firebase app initialization
import {
  User, Mail, Briefcase, Building, Link as LinkIcon, Youtube, X, Edit, LogOut, Save, XCircle
} from 'lucide-react'; // Icons for profile details
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

export default function Profile() {
  const [profileData, setProfileData] = useState(null); // Data displayed
  const [editFormData, setEditFormData] = useState(null); // Data being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const auth = getAuth(app);
    const database = getDatabase(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userData = {
          name: user.displayName || 'N/A', // Fallback to N/A if displayName is null
          email: user.email || 'N/A',
          uid: user.uid,
          photoURL: user.photoURL || null,
          role: 'N/A',
          industry: 'N/A',
          platforms: {
            reddit: 'N/A',
            youtube: 'N/A',
            x: 'N/A',
          },
        };

        try {
          const userRef = ref(database, 'users/' + user.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const dbData = snapshot.val();
            userData = {
              ...userData,
              // Prioritize DB name if available, otherwise use Auth displayName or 'N/A'
              name: dbData.name || userData.name,
              role: dbData.role || userData.role,
              industry: dbData.industry || userData.industry,
              platforms: {
                reddit: dbData.platforms?.reddit || 'N/A',
                youtube: dbData.platforms?.youtube || 'N/A',
                x: dbData.platforms?.x || 'N/A',
              },
            };
          }
        } catch (dbError) {
          console.error("Error fetching profile from Realtime Database:", dbError);
          setError("Failed to load full profile data. Please try again.");
        }

        setProfileData(userData);
        setEditFormData(userData); // Initialize edit form data with current profile data
      } else {
        setProfileData(null);
        setEditFormData(null);
        setError("You must be logged in to view this page.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Derive the user's initials for the avatar
  const userInitials = profileData?.name
    ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'G'; // Default to 'G' for 'Guest' or loading

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // When entering edit mode, reset editFormData to current profileData
    if (!isEditing) {
      setEditFormData(profileData);
      setSuccessMessage(''); // Clear any previous success messages
    } else {
      // If cancelling, clear any changes in editFormData
      setEditFormData(profileData);
    }
    setError(''); // Clear any previous errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested 'platforms' object
    if (name.startsWith('platforms.')) {
      const platformKey = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        platforms: {
          ...prev.platforms,
          [platformKey]: value,
        },
      }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    const auth = getAuth(app);
    const database = getDatabase(app);
    const user = auth.currentUser;

    if (!user || !editFormData) {
      setError("No user logged in or data to save.");
      setLoading(false);
      return;
    }

    try {
      // 1. Update Firebase Authentication displayName if it changed
      if (user.displayName !== editFormData.name) {
        await updateFirebaseAuthProfile(user, { displayName: editFormData.name });
      }

      // 2. Update Realtime Database
      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        name: editFormData.name,
        email: editFormData.email, // Email generally shouldn't be changed via profile edit, but included for completeness if your DB schema allows
        role: editFormData.role,
        industry: editFormData.industry,
        platforms: editFormData.platforms,
        uid: user.uid,
      });

      setProfileData(editFormData); // Update displayed data
      setIsEditing(false); // Exit edit mode
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile changes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      setProfileData(null); // Clear profile data
      setEditFormData(null);
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md">
          No profile data available. Please log in.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-8 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-2xl p-10 border border-green-100/50 relative overflow-y-auto max-h-[90vh]"> {/* Added overflow-y-auto and max-h */}
        {/* Edit and Logout Buttons */}
        <div className="absolute top-6 right-6 flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md"
                title="Save Changes"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={handleEditToggle} // Cancel button
                className="p-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors shadow-md"
                title="Cancel"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
              title="Edit Profile"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-lime-600 rounded-full flex items-center justify-center mx-auto shadow-lg mb-4 text-white text-4xl font-bold">
            {userInitials}
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text text-transparent mb-2">
            {profileData.name}
          </h2>
          <p className="text-gray-600 text-lg">Pro Member</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm mb-4">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          <ProfileDetail
            icon={<Mail className="w-5 h-5 text-green-600" />}
            label="Email"
            value={profileData.email}
            isEditing={false} // Email is usually not editable
          />
          <ProfileDetail
            icon={<Briefcase className="w-5 h-5 text-green-600" />}
            label="Role/Position"
            value={isEditing ? editFormData.role : profileData.role}
            isEditing={isEditing}
            onChange={handleChange}
            name="role"
          />
          <ProfileDetail
            icon={<Building className="w-5 h-5 text-green-600" />}
            label="Industry"
            value={isEditing ? editFormData.industry : profileData.industry}
            isEditing={isEditing}
            onChange={handleChange}
            name="industry"
          />

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text text-transparent mb-4">
              Social Media Profiles
            </h3>
            <div className="space-y-4">
              {/* Using LinkIcon for Reddit as Reddit icon is not directly available from Lucide React */}
              <ProfileLink
                icon={<LinkIcon className="w-5 h-5 text-orange-600" />}
                label="Reddit"
                url={isEditing ? editFormData.platforms.reddit : profileData.platforms.reddit}
                isEditing={isEditing}
                onChange={handleChange}
                name="platforms.reddit"
              />
              <ProfileLink
                icon={<Youtube className="w-5 h-5 text-red-600" />}
                label="YouTube"
                url={isEditing ? editFormData.platforms.youtube : profileData.platforms.youtube}
                isEditing={isEditing}
                onChange={handleChange}
                name="platforms.youtube"
              />
              <ProfileLink
                icon={<X className="w-5 h-5 text-gray-900" />}
                label="X (Twitter)"
                url={isEditing ? editFormData.platforms.x : profileData.platforms.x}
                isEditing={isEditing}
                onChange={handleChange}
                name="platforms.x"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying a single profile detail
const ProfileDetail = ({ icon, label, value, isEditing, onChange, name }) => (
  <div className="flex items-center gap-4 p-3 bg-green-50/50 rounded-lg shadow-sm">
    {icon}
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      {isEditing ? (
        <input
          type={name === 'email' ? 'email' : 'text'} // Use email type for email field
          name={name}
          value={value}
          onChange={onChange}
          className="text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-600"
        />
      ) : (
        <div className="text-lg font-semibold text-gray-800">{value}</div>
      )}
    </div>
  </div>
);

// Helper component for displaying a social media link
const ProfileLink = ({ icon, label, url, isEditing, onChange, name }) => {
  const isAvailable = url && url !== 'N/A';
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm">
      {icon}
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        {isEditing ? (
          <input
            type="url" // Use url type for URL fields
            name={name}
            value={url}
            onChange={onChange}
            placeholder={`https://${label.toLowerCase()}.com/username`}
            className="text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-600 w-full"
          />
        ) : isAvailable ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            {url} <LinkIcon className="w-4 h-4" />
          </a>
        ) : (
          <div className="text-lg font-semibold text-gray-500">Not provided</div>
        )}
      </div>
    </div>
  );
};
