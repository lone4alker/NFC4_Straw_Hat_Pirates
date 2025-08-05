import React from 'react';
import { FileText, Calendar } from 'lucide-react';

export default function FinalDrafts({ drafts, handleDeleteDraft, handleOpenScheduleModal }) {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Final Drafts</h2>
      {drafts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No drafts yet</p>
          <p className="text-gray-400 text-sm">Messages you move to drafts will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-gray-500">
                  Added {draft.timestamp.toLocaleDateString()} at {draft.timestamp.toLocaleTimeString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenScheduleModal(draft)}
                    className="text-emerald-500 hover:text-emerald-600 text-sm transition-colors flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="text-red-500 hover:text-red-600 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {draft.image && (
                <img 
                  src={URL.createObjectURL(draft.image)} 
                  alt="Draft content" 
                  className="max-w-full h-auto rounded-lg mb-4" 
                />
              )}
              <div className="text-gray-900 whitespace-pre-wrap">{draft.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}