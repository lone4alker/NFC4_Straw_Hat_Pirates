import React, { useState, useEffect } from 'react';
import { X, Repeat, Calendar, Clock } from 'lucide-react';

export default function ScheduleModal({ isOpen, onClose, draft, onSchedule }) {
  const [editedContent, setEditedContent] = useState(draft?.content || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [endDate, setEndDate] = useState('');
  const [numberOfOccurrences, setNumberOfOccurrences] = useState(5);
  const [endType, setEndType] = useState('never'); // 'never', 'date', 'occurrences'

  useEffect(() => {
    if (draft) {
      setEditedContent(draft.content);
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      
      const dateString = tomorrow.toISOString().split('T')[0];
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setScheduledDate(dateString);
      setScheduledTime(timeString);
      
      // Set default end date to 30 days from now
      const defaultEndDate = new Date(now);
      defaultEndDate.setDate(now.getDate() + 30);
      setEndDate(defaultEndDate.toISOString().split('T')[0]);
    }
  }, [draft]);

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (draft && editedContent && scheduledDate && scheduledTime) {
      const scheduleData = {
        content: editedContent,
        date: scheduledDate,
        time: scheduledTime,
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : null,
        recurrenceInterval: isRecurring ? recurrenceInterval : null,
        endType: isRecurring ? endType : null,
        endDate: isRecurring && endType === 'date' ? endDate : null,
        numberOfOccurrences: isRecurring && endType === 'occurrences' ? numberOfOccurrences : null,
      };
      
      onSchedule(draft.id, scheduleData);
      onClose();
    }
  };

  const recurrenceOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const getRecurrencePreview = () => {
    if (!isRecurring) return '';
    
    const interval = recurrenceInterval > 1 ? `every ${recurrenceInterval}` : 'every';
    const type = recurrenceType === 'daily' ? 'day' : 
                 recurrenceType === 'weekly' ? 'week' : 
                 recurrenceType === 'monthly' ? 'month' : 'year';
    const plural = recurrenceInterval > 1 ? (type + 's') : type;
    
    let endText = '';
    if (endType === 'date') {
      endText = ` until ${new Date(endDate).toLocaleDateString()}`;
    } else if (endType === 'occurrences') {
      endText = ` for ${numberOfOccurrences} times`;
    }
    
    return `Repeats ${interval} ${plural}${endText}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Schedule Content</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your message..."
              />
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Recurring Options */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="recurring" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Repeat className="w-4 h-4" />
                  Make this recurring
                </label>
              </div>

              {isRecurring && (
                <div className="space-y-4 pl-6 border-l-2 border-emerald-100">
                  {/* Recurrence Type and Interval */}
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat every
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={recurrenceInterval}
                          onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                          className="w-20 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                          value={recurrenceType}
                          onChange={(e) => setRecurrenceType(e.target.value)}
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {recurrenceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* End Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End repeat
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="never"
                          checked={endType === 'never'}
                          onChange={(e) => setEndType(e.target.value)}
                          className="text-emerald-600"
                        />
                        <span className="text-sm text-gray-700">Never</span>
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="date"
                          checked={endType === 'date'}
                          onChange={(e) => setEndType(e.target.value)}
                          className="text-emerald-600"
                        />
                        <span className="text-sm text-gray-700">On date:</span>
                        {endType === 'date' && (
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="ml-2 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                          />
                        )}
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="occurrences"
                          checked={endType === 'occurrences'}
                          onChange={(e) => setEndType(e.target.value)}
                          className="text-emerald-600"
                        />
                        <span className="text-sm text-gray-700">After:</span>
                        {endType === 'occurrences' && (
                          <div className="flex items-center gap-1 ml-2">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={numberOfOccurrences}
                              onChange={(e) => setNumberOfOccurrences(parseInt(e.target.value) || 1)}
                              className="w-16 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                            />
                            <span className="text-sm text-gray-700">occurrences</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  {isRecurring && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <p className="text-sm text-emerald-700">
                        <strong>Preview:</strong> {getRecurrencePreview()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!editedContent.trim() || !scheduledDate || !scheduledTime}
            >
              {isRecurring ? 'Schedule Recurring' : 'Schedule Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}