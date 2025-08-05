import React from 'react';
import { Image, Bot, Copy, Trash2 } from 'lucide-react';

const FinalDrafts = ({ drafts, onDeleteDraft }) => {
  if (drafts.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Final Drafts Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Messages you move to final drafts will appear here. Use the "Move to Drafts" button on assistant messages to save them.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Drafts</h2>
          <p className="text-gray-600">Your saved assistant responses ({drafts.length} items)</p>
        </div>
        
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-500">
                      Added {draft.timestamp.toLocaleDateString()} at {draft.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-900 whitespace-pre-wrap">
                    {draft.content}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteDraft(draft.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete draft"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigator.clipboard.writeText(draft.content)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-700 rounded-md transition-all"
                >
                  <Copy size={12} />
                  Copy Draft
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalDrafts;