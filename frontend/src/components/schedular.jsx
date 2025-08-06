import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Repeat, Edit2, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function Scheduler({ scheduledMessages, setActiveView }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [scheduledItems, setScheduledItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const scheduledRef = ref(db, `scheduled/${user.uid}`);

    const unsubscribe = onValue(scheduledRef, (snapshot) => {
      const data = snapshot.val();
      const loadedScheduled = [];
      
      if (data) {
        for (const id in data) {
          if (data.hasOwnProperty(id)) {
            loadedScheduled.push({
              id: id,
              ...data[id],
              scheduledFor: new Date(data[id].scheduledFor),
              createdAt: new Date(data[id].createdAt),
            });
          }
        }
      }
      
      setScheduledItems(loadedScheduled);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching scheduled items:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return scheduledItems.filter(item => 
      item.scheduledFor.toDateString() === date.toDateString()
    );
  };

  const handleDeleteEvent = async (eventId) => {
    if (!user) return;
    
    try {
      const db = getDatabase();
      const eventRef = ref(db, `scheduled/${user.uid}/${eventId}`);
      await remove(eventRef);
      setShowEventModal(false);
    } catch (error) {
      console.error('Error deleting scheduled item:', error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const EventModal = ({ event, onClose, onDelete }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Post</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">&times;</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{event.scheduledFor.toLocaleDateString()}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{formatTime(event.scheduledFor)}</span>
            </div>
            
            {event.recurrence && (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Repeat className="w-4 h-4" />
                <span>Repeats {event.recurrence}</span>
              </div>
            )}
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{event.content}</p>
            </div>
            
            <div className="text-xs text-gray-500">
              Status: <span className="capitalize font-medium">{event.status}</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => onDelete(event.id)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Please log in to view your scheduler</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Content Scheduler</h2>
          <button
            onClick={() => setActiveView('drafts')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule New Content
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading scheduled content...</p>
          </div>
        ) : (
          <>
            {/* Calendar Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{scheduledItems.length} scheduled posts</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((date, index) => {
                    const events = date ? getEventsForDate(date) : [];
                    const isToday = date && date.toDateString() === new Date().toDateString();
                    const isPastDate = date && date < new Date().setHours(0,0,0,0);
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-colors ${
                          date 
                            ? isToday 
                              ? 'bg-emerald-50 border-emerald-200' 
                              : 'hover:bg-gray-50'
                            : 'bg-gray-50'
                        }`}
                        onClick={() => date && setSelectedDate(date)}
                      >
                        {date && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? 'text-emerald-600' : isPastDate ? 'text-gray-400' : 'text-gray-900'
                            }`}>
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {events.slice(0, 3).map(event => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded truncate cursor-pointer ${
                                    event.status === 'pending' ? 'bg-blue-100 text-blue-700' : 
                                    event.status === 'posted' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                    setShowEventModal(true);
                                  }}
                                >
                                  {formatTime(event.scheduledFor)} - {event.content.substring(0, 20)}...
                                </div>
                              ))}
                              {events.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{events.length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Posts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Posts</h3>
              </div>
              <div className="p-4">
                {scheduledItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No scheduled posts yet</p>
                    <p className="text-gray-400 text-sm">
                      Schedule content from your drafts to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduledItems
                      .filter(item => item.scheduledFor >= new Date())
                      .sort((a, b) => a.scheduledFor - b.scheduledFor)
                      .slice(0, 5)
                      .map(item => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedEvent(item);
                            setShowEventModal(true);
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span>{item.scheduledFor.toLocaleDateString()}</span>
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(item.scheduledFor)}</span>
                              {item.recurrence && (
                                <>
                                  <Repeat className="w-4 h-4 text-emerald-600" />
                                  <span className="text-emerald-600">{item.recurrence}</span>
                                </>
                              )}
                            </div>
                            <p className="text-gray-900 text-sm">{item.content.substring(0, 100)}...</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'pending' ? 'bg-blue-100 text-blue-700' : 
                            item.status === 'posted' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {item.status}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Event Modal */}
        {showEventModal && selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  );
}