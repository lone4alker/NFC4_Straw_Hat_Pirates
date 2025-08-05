import React from 'react';
import { Bot, Plus } from 'lucide-react';

const SidebarHeader = ({ onNewChat }) => {
  return (
    <div className="p-4 flex-shrink-0">
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Bot size={24} className="text-white" />
        </div>
      </div>
      
      <button 
        onClick={onNewChat}
        className="flex items-center gap-3 w-full p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        <Plus size={20} />
        <span className="font-medium">New Chat</span>
      </button>
    </div>
  );
};

export default SidebarHeader;
