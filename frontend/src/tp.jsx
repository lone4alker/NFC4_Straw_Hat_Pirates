import React, { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from './components/firebase'; // Your firebase config
import Sidebar from './components/Sidebar';
import Dashboard from './components/DashBoard';
import Conversations from './components/Conversations';
import FinalDrafts from './components/FinalDrafts';
import Placeholder from './components/Placeholder';
import ScheduleModal from './components/ScheduleModal';
import Collaboration from './components/Collaboration';
import Templates from './components/Templates';
import Scheduler from './components/Schedular';

export default function CloutCraftApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentDraftToSchedule, setCurrentDraftToSchedule] = useState(null);
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [moveSuccessMessage, setMoveSuccessMessage] = useState('');
  const [initialConversationPrompt, setInitialConversationPrompt] = useState(''); // New state for initial prompt

  // Get Firebase auth instance and current user
  const auth = getAuth(app);
  const user = auth.currentUser;

  const userInfo = {
    name: user?.displayName || "John Doe",
    email: user?.email || "john.doe@example.com"
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'conversations', label: 'Conversations', icon: 'MessageSquare' },
    { id: 'templates', label: 'Templates', icon: 'FileText' },
    { id: 'scheduler', label: 'Scheduler', icon: 'Calendar' },
    { id: 'drafts', label: 'Final Drafts', icon: 'FileText' },
    { id: 'collaboration', label: 'Collaboration', icon: 'Users' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  // Modified setActiveView to accept an optional prompt
  const handleSetActiveView = (view, prompt = '') => {
    setActiveView(view);
    setInitialConversationPrompt(prompt); // Set the prompt for Conversations
  };

  const handleNewChat = () => {
    handleSetActiveView('conversations', ''); // Clear prompt for new chat
    setMoveSuccessMessage('New chat started!');
    setTimeout(() => setMoveSuccessMessage(''), 2000);
  };

  // Firebase integration for moving messages to drafts
  const handleMoveToDrafts = async (message) => {
    if (!user) {
      setMoveSuccessMessage('Please log in to save drafts');
      setTimeout(() => setMoveSuccessMessage(''), 3000);
      return;
    }

    try {
      const db = getDatabase(app);
      const draftsRef = ref(db, `drafts/${user.uid}`);

      // Prepare the draft data to match your FinalDrafts component structure
      const draftData = {
        content: message.content,
        timestamp: message.timestamp || new Date().toISOString(),
        type: message.type || 'assistant',
        movedFromChat: true,
        originalMessageId: message.id,
        // Note: Image handling would require Firebase Storage integration
        // For now, we'll just note if there was an image
        hasImage: !!message.image,
        // If you want to store image URLs from Firebase Storage, add:
        // imageUrl: message.imageUrl || null
      };

      // Push the draft to Firebase
      const newDraftRef = await push(draftsRef, draftData);

      setMoveSuccessMessage('Message moved to Final Drafts!');
      setTimeout(() => setMoveSuccessMessage(''), 3000);

      console.log('Message successfully moved to drafts with ID:', newDraftRef.key);

    } catch (error) {
      console.error('Error moving message to drafts:', error);
      setMoveSuccessMessage('Failed to move message to drafts. Please try again.');
      setTimeout(() => setMoveSuccessMessage(''), 3000);
    }
  };

  const handleOpenScheduleModal = (draft) => {
    setCurrentDraftToSchedule(draft);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setCurrentDraftToSchedule(null);
  };

  // Enhanced scheduling function to handle recurring posts
  const handleScheduleDraft = async (draftId, scheduleData) => {
    if (!user) {
      setMoveSuccessMessage('Please log in to schedule messages');
      setTimeout(() => setMoveSuccessMessage(''), 3000);
      return;
    }

    try {
      const db = getDatabase(app);
      const scheduledRef = ref(db, `scheduled/${user.uid}`);

      // Create the base scheduled date/time
      const baseDateTime = new Date(`${scheduleData.date}T${scheduleData.time}`);

      if (scheduleData.isRecurring) {
        // Generate multiple scheduled posts based on recurrence settings
        const scheduledPosts = generateRecurringPosts(scheduleData, baseDateTime);

        // Save each scheduled post
        for (const post of scheduledPosts) {
          const scheduledData = {
            originalDraftId: draftId,
            content: scheduleData.content,
            scheduledFor: post.scheduledFor.toISOString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            recurrence: post.recurrenceInfo,
            isRecurring: true,
            recurrenceGroup: post.groupId // To identify posts that belong to the same recurring series
          };

          await push(scheduledRef, scheduledData);
        }

        setMoveSuccessMessage(`${scheduledPosts.length} recurring posts scheduled successfully!`);

      } else {
        // Single scheduled post
        const scheduledData = {
          originalDraftId: draftId,
          content: scheduleData.content,
          scheduledFor: baseDateTime.toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          isRecurring: false
        };

        await push(scheduledRef, scheduledData);
        setMoveSuccessMessage(`Draft scheduled for ${baseDateTime.toLocaleString()}!`);
      }

      // Auto-navigate to scheduler after successful scheduling
      setTimeout(() => {
        handleSetActiveView('scheduler'); // Use handleSetActiveView
        setMoveSuccessMessage('');
      }, 2000);

    } catch (error) {
      console.error('Error scheduling draft:', error);
      setMoveSuccessMessage('Failed to schedule draft. Please try again.');
      setTimeout(() => setMoveSuccessMessage(''), 3000);
    }
  };

  // Helper function to generate recurring posts
  const generateRecurringPosts = (scheduleData, baseDateTime) => {
    const posts = [];
    const groupId = Date.now().toString(); // Unique group ID for this recurring series
    let currentDate = new Date(baseDateTime);
    let count = 0;
    const maxPosts = scheduleData.endType === 'occurrences' ? scheduleData.numberOfOccurrences : 100;
    const endDate = scheduleData.endType === 'date' ? new Date(scheduleData.endDate) : null;

    while (count < maxPosts) {
      // Stop if we've reached the end date
      if (endDate && currentDate > endDate) break;

      // Stop if we're only doing a certain number of occurrences
      if (scheduleData.endType === 'occurrences' && count >= scheduleData.numberOfOccurrences) break;

      // Add current date to posts
      posts.push({
        scheduledFor: new Date(currentDate),
        groupId: groupId,
        recurrenceInfo: `${scheduleData.recurrenceType} (${count + 1}/${scheduleData.endType === 'occurrences' ? scheduleData.numberOfOccurrences : '∞'})`
      });

      // Calculate next occurrence
      switch (scheduleData.recurrenceType) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + scheduleData.recurrenceInterval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * scheduleData.recurrenceInterval));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + scheduleData.recurrenceInterval);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + scheduleData.recurrenceInterval);
          break;
      }

      count++;

      // Safety check to prevent infinite loops
      if (count > 1000) break;
    }

    return posts;
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={handleSetActiveView} />;
      case 'conversations':
        return (
          <Conversations
            handleMoveToDrafts={handleMoveToDrafts}
            initialPrompt={initialConversationPrompt} // Pass the initial prompt here
          />
        );
      case 'drafts':
        return (
          <FinalDrafts
            handleOpenScheduleModal={handleOpenScheduleModal}
          />
        );
      case 'templates':
        return <Templates setActiveView={handleSetActiveView} />; {/* Pass handleSetActiveView */}
      case 'collaboration':
        return <Collaboration />;
      case 'scheduler':
        return (
          <Scheduler
            scheduledMessages={scheduledMessages}
            setActiveView={handleSetActiveView}
          />
        );
      case 'settings':
        return <Placeholder title={navItems.find(item => item.id === activeView)?.label || 'Coming Soon'} />;
      default:
        return <Dashboard setActiveView={handleSetActiveView} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <div className="flex h-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeView={activeView}
          setActiveView={handleSetActiveView}
          handleNewChat={handleNewChat}
          navItems={navItems}
          userInfo={userInfo}
        />

        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden bg-white">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-lg">CloutCraft</span>
            </div>
          </div>

          {/* Success/Error Messages */}
          {moveSuccessMessage && (
            <div className={`mx-4 mt-2 p-3 rounded-lg text-sm border ${
              moveSuccessMessage.includes('Failed') || moveSuccessMessage.includes('Please log in')
                ? 'bg-red-100 border-red-500 text-red-700'
                : 'bg-emerald-100 border-emerald-500 text-emerald-700'
            }`}>
              {moveSuccessMessage}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-h-0">
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* Enhanced Schedule Modal */}
      {currentDraftToSchedule && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseScheduleModal}
          draft={currentDraftToSchedule}
          onSchedule={handleScheduleDraft}
        />
      )}
    </div>
  );
}
