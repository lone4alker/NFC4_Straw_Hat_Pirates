import React from 'react';
import { User, Settings } from 'lucide-react';

const SidebarUserProfile = ({ userName = "John Doe", userEmail = "john.doe@example.com" }) => {
  return (
    <div className="p-4 border-t border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
        {/* Profile Picture */}
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-white" />
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-sm truncate">
            {userName}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {userEmail}
          </div>
        </div>
        
        {/* Settings Icon */}
        <button className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default SidebarUserProfile;