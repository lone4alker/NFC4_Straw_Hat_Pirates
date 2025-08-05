import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // adjust path as needed
import { getDatabase, ref, get, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { User, Edit3, Save, X, Mail, Briefcase, Building, Sparkles } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    industry: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData({
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          industry: data.industry || ''
        });
        setEditForm({
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          industry: data.industry || ''
        });
      }
    } catch (error) {
      showMessage('Error fetching user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...userData });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      
      await update(userRef, {
        name: editForm.name,
        role: editForm.role,
        industry: editForm.industry
      });

      setUserData({ ...editForm });
      setIsEditing(false);
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      showMessage('Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <User className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
          <p className="text-gray-300">You need to be logged in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-bounce"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-ping`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight">
              ClautCraft
            </h1>
            <p className="text-gray-300 text-lg">Your Digital Identity Hub</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-6 pb-12">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-2xl p-8">
          
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              messageType === 'success' 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-red-500/20 border-red-500/30 text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{userData.name || 'User'}</h2>
            <p className="text-gray-400">Manage your profile information</p>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {!isEditing ? (
              // View Mode
              <>
                <ProfileField 
                  icon={<User className="w-5 h-5" />}
                  label="Full Name"
                  value={userData.name || 'Not provided'}
                />
                
                <ProfileField 
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  value={userData.email || 'Not provided'}
                  disabled
                />
                
                <ProfileField 
                  icon={<Briefcase className="w-5 h-5" />}
                  label="Role/Position"
                  value={userData.role || 'Not provided'}
                />
                
                <ProfileField 
                  icon={<Building className="w-5 h-5" />}
                  label="Industry"
                  value={userData.industry || 'Not provided'}
                />

                <div className="pt-6">
                  <button
                    onClick={handleEdit}
                    className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              // Edit Mode
              <>
                <EditField 
                  icon={<User className="w-5 h-5" />}
                  label="Full Name"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                
                <EditField 
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  name="email"
                  value={editForm.email}
                  disabled
                  placeholder="Email cannot be changed"
                />
                
                <EditField 
                  icon={<Briefcase className="w-5 h-5" />}
                  label="Role/Position"
                  name="role"
                  value={editForm.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Scientist, Student, Manager"
                />
                
                <EditField 
                  icon={<Building className="w-5 h-5" />}
                  label="Industry"
                  name="industry"
                  value={editForm.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., Technology, Healthcare, Education"
                />

                <div className="pt-6 flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Field Component (View Mode)
const ProfileField = ({ icon, label, value, disabled }) => (
  <div className="group">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-cyan-400 group-hover:text-purple-400 transition-colors duration-200">
        {icon}
      </div>
      <label className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-200">
        {label}
      </label>
    </div>
    <div className={`w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white ${
      disabled ? 'opacity-60' : ''
    }`}>
      {value}
    </div>
  </div>
);

// Edit Field Component (Edit Mode)
const EditField = ({ icon, label, name, value, onChange, placeholder, disabled }) => (
  <div className="group">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-cyan-400 group-focus-within:text-purple-400 transition-colors duration-200">
        {icon}
      </div>
      <label className="text-sm font-semibold text-gray-300 group-focus-within:text-white transition-colors duration-200">
        {label}
      </label>
    </div>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 hover:bg-slate-700/70 hover:border-slate-500/50 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

export default UserProfile;