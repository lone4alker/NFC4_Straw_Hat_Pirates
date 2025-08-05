import React from 'react';
import { MessageSquare, Sparkles, Code, Image } from 'lucide-react';

const Navigation = ({ activeView, setActiveView }) => {
  const sidebarItems = [
    { icon: MessageSquare, label: 'Conversations', view: 'conversations' },
    { icon: Sparkles, label: 'Templates', view: 'templates' },
    { icon: Code, label: 'Scheduler', view: 'scheduler' },
    { icon: Image, label: 'Final Drafts', view: 'drafts' }
  ];

  return (
    <div className="px-4 py-2 flex-shrink-0">
      <div className="space-y-2">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
              activeView === item.view
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
