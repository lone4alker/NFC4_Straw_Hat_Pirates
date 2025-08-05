import React from 'react';
import { Settings } from 'lucide-react';
import MessageArea from './MessageArea';
import FinalDrafts from './FinalDrafts';
import ClauseTemplates from './templ'; // ✅ import this!

const MainContent = ({ activeView, messages, drafts, onCopyMessage, onMoveToDrafts, onDeleteDraft }) => {
  if (activeView === 'drafts') {
    return <FinalDrafts drafts={drafts} onDeleteDraft={onDeleteDraft} />;
  }

  if (activeView === 'conversations') {
    return (
      <MessageArea 
        messages={messages} 
        onCopyMessage={onCopyMessage}
        onMoveToDrafts={onMoveToDrafts}
      />
    );
  }

  if (activeView === 'templates') {
    return <ClauseTemplates />; // ✅ Render the Templates component
  }

  // Placeholder for other views (e.g., scheduler)
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            This section is coming soon. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;