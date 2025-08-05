import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ScheduleModal({ isOpen, onClose, draft, onSchedule }) {
  const [editedContent, setEditedContent] = useState(draft?.content || '');
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  useEffect(() => {
    if (draft) {
      setEditedContent(draft.content);
      const now = new Date();
      const initialDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setScheduledDateTime(initialDateTime);
    }
  }, [draft]);

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (draft && editedContent && scheduledDateTime) {
      onSchedule(draft.id, editedContent, scheduledDateTime.split('T')[0], scheduledDateTime.split('T')[1]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Edit & Schedule</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your message..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Date & Time:
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!editedContent.trim() || !scheduledDateTime}
            >
              Save to Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}