import React from 'react';
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

const icons = {
  BarChart3,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Settings
};

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeView, setActiveView, handleNewChat, navItems, userInfo }) {
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
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <div className="font-medium text-gray-900">{userInfo.name}</div>
              <div className="text-sm text-gray-500">Pro Member</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}