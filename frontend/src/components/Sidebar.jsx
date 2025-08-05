import React from 'react';
import SidebarHeader from './SidebarHeader';
import Navigation from './Navigation';
import SidebarUserProfile from './SidebarUserProfile';

const Sidebar = ({ 
  sidebarOpen, 
  activeView,
  setActiveView,
  onNewChat,
  userName,
  userEmail
}) => {
  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex flex-col h-full`}>
      <SidebarHeader onNewChat={onNewChat} />
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      {/* Spacer to push user profile to bottom */}
      <div className="flex-1"></div>
      
      <SidebarUserProfile userName={userName} userEmail={userEmail} />
    </div>
  );
};

export default Sidebar;
