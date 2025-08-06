import React, { useRef, useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/DashBoard';
import Conversations from './components/Conversations';
import FinalDrafts from './components/FinalDrafts';
import Placeholder from './components/Placeholder';
import ScheduleModal from './components/ScheduleModal';
import Collaboration from './components/Collaboration';
import Templates from './components/Templates';
import Scheduler from './components/Schedular';

// Mock service function - replace with your actual service
// This is kept for demonstration if the actual ollamaservices is not running
const sendPromptToBackend = async (prompt) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (prompt.toLowerCase().includes('collaboration')) {
    return 'Collaboration is a powerful feature! You can grant access to team members to view and edit your drafts. Go to the "Collaboration" tab, select a draft, and invite teammates via email to start working together in real-time.';
  }

  return `This is a mock response to: "${prompt}". In a real implementation, this would come from your AI backend.`;
};

export default function CloutCraftApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentDraftToSchedule, setCurrentDraftToSchedule] = useState(null);

  // Lifted state for chat messages, input, loading, and image file from Conversations.js
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [drafts, setDrafts] = useState([]);
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [moveSuccessMessage, setMoveSuccessMessage] = useState('');
  
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com"
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

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    setInputValue('');
    setImageFile(null); // Reset image file on new chat
    setIsLoading(false); // Reset loading state on new chat
    setActiveView('conversations');
    setMoveSuccessMessage('New chat started!');
    setTimeout(() => setMoveSuccessMessage(''), 2000);
  };

  // This handleSendMessage is for the mock backend.
  // The actual Conversations component will use its own handleSendMessage
  // which calls the generateText service. This function is not directly used by Conversations now.
  const handleSendMessage = async () => {
    if (!inputValue.trim() && !imageFile) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      image: imageFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setImageFile(null);
    setIsLoading(true);

    try {
      // This part would ideally be handled by the generateText service in Conversations.js
      // This mock is just a fallback if ollamaservices isn't fully integrated or available.
      const responseText = await sendPromptToBackend(inputValue); 

      const assistantMessage = {
        id: userMessage.id + 1,
        type: 'assistant',
        content: responseText || 'Error: No response from AI.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: userMessage.id + 1,
        type: 'assistant',
        content: 'Something went wrong while contacting the AI backend.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    setMoveSuccessMessage('Image attached. Send your message to use it!');
    setTimeout(() => setMoveSuccessMessage(''), 3000);
  };
  
  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setMoveSuccessMessage('Message copied to clipboard!');
    setTimeout(() => setMoveSuccessMessage(''), 2000);
  };

  const handleMoveToDrafts = (message) => {
    const existingDraft = drafts.find(draft => draft.originalMessageId === message.id);
    if (existingDraft) {
      setMoveSuccessMessage('Message already in drafts!');
      setTimeout(() => setMoveSuccessMessage(''), 3000);
      return;
    }

    const draftItem = {
      id: Date.now(),
      content: message.content,
      image: message.image || null,
      timestamp: new Date()
    };
    
    setDrafts(prevDrafts => [...prevDrafts, draftItem]);
    setMoveSuccessMessage('Message moved to Final Drafts!');
    setTimeout(() => setMoveSuccessMessage(''), 3000);
  };

  const handleDeleteDraft = (draftId) => {
    setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
    setMoveSuccessMessage('Draft deleted successfully!');
    setTimeout(() => setMoveSuccessMessage(''), 3000);
  };

  const handleOpenScheduleModal = (draft) => {
    setCurrentDraftToSchedule(draft);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setCurrentDraftToSchedule(null);
  };

  const handleScheduleDraft = (draftId, newContent, date, time) => {
    const scheduledDateTime = new Date(`${date}T${time}`);
    const draftToSchedule = drafts.find(d => d.id === draftId);
    if (draftToSchedule) {
        const newScheduledMessage = {
            ...draftToSchedule,
            content: newContent,
            scheduledFor: scheduledDateTime,
            status: 'pending'
        };
        setScheduledMessages(prev => [...prev, newScheduledMessage]);
        setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
    }

    setMoveSuccessMessage(`Draft scheduled for ${scheduledDateTime.toLocaleString()}! A reminder will be sent via email.`);
    setTimeout(() => setMoveSuccessMessage(''), 5000);
    handleCloseScheduleModal();
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'conversations':
        return (
          <Conversations
            messages={messages}
            setMessages={setMessages} // Pass setter
            inputValue={inputValue}
            setInputValue={setInputValue} // Pass setter
            isLoading={isLoading}
            setIsLoading={setIsLoading} // Pass setter
            handleSendMessage={handleSendMessage} // This is the mock one, Conversations.js uses its own
            handleImageUpload={handleImageUpload}
            handleCopyMessage={handleCopyMessage}
            handleMoveToDrafts={handleMoveToDrafts}
            handleNewChat={handleNewChat}
            imageFile={imageFile}
            setImageFile={setImageFile} // Pass setter
          />
        );
      case 'drafts':
        return (
          <FinalDrafts
            drafts={drafts}
            handleDeleteDraft={handleDeleteDraft}
            handleOpenScheduleModal={handleOpenScheduleModal}
          />
        );
      case 'templates':
        return <Templates />;
      case 'collaboration':
        return <Collaboration />;
      case 'scheduler':
        return <Scheduler scheduledMessages={scheduledMessages} />;
      case 'settings':
        return <Placeholder title={navItems.find(item => item.id === activeView)?.label || 'Coming Soon'} />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <div className="flex h-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          handleNewChat={handleNewChat}
          navItems={navItems}
          userInfo={userInfo}
        />

        <div className="flex-1 flex flex-col">
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

          {moveSuccessMessage && (
            <div className="mx-4 mt-2 p-3 bg-emerald-100 border border-emerald-500 text-emerald-700 rounded-lg text-sm">
              {moveSuccessMessage}
            </div>
          )}

          {renderMainContent()}
        </div>
      </div>
      
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
