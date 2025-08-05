import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  Zap,
  Palette,
  BarChart3,
  Send,
  Copy,
  ArrowRight,
  Menu,
  X,
  Plus,
  Image,
  Clock,
  Mail,
  Share,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Check
} from 'lucide-react';

// Mock service functions
const sendPromptToBackend = async (prompt) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `This is a mock response to: "${prompt}". In a real implementation, this would come from your AI backend.`;
};

const sendScheduledEmail = async (content, date, email) => {
  // Mock email scheduling
  console.log(`Scheduling email for ${date} to ${email}:`, content);
  return true;
};

export default function CloutCraftApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Chat Interface State
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [scheduledDrafts, setScheduledDrafts] = useState([]);
  const [moveSuccessMessage, setMoveSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [currentDraftForSchedule, setCurrentDraftForSchedule] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Collaboration state
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Editor', avatar: 'SJ' },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', role: 'Viewer', avatar: 'MC' }
  ]);
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabRole, setNewCollabRole] = useState('Viewer');

  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'drafts', label: 'Final Drafts', icon: FileText },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const templates = [
    { title: 'LinkedIn Post', type: 'Professional', color: 'bg-emerald-600' },
    { title: 'Twitter Thread', type: 'Engaging', color: 'bg-green-600' },
    { title: 'Startup Update', type: 'Business', color: 'bg-emerald-500' },
    { title: 'Leadership Tips', type: 'Thought Leadership', color: 'bg-green-500' }
  ];

  const tones = [
    { name: 'Professional', description: 'Formal and business-focused', icon: '💼' },
    { name: 'Casual', description: 'Friendly and conversational', icon: '😊' },
    { name: 'Inspiring', description: 'Motivational and uplifting', icon: '🚀' },
    { name: 'Educational', description: 'Informative and teaching', icon: '🎓' }
  ];

  // Chat Interface Functions
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
    setActiveView('conversations');
    setMoveSuccessMessage('New chat started!');
    setTimeout(() => setMoveSuccessMessage(''), 2000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
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

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageMessage = {
            id: messages.length + 1,
            type: 'user',
            content: `[Image uploaded: ${file.name}]`,
            image: e.target.result,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, imageMessage]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
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
      timestamp: new Date(),
      originalMessageId: message.id,
      status: 'draft'
    };
    
    setDrafts(prevDrafts => [...prevDrafts, draftItem]);
    setMoveSuccessMessage('Message moved to Final Drafts!');
    setTimeout(() => setMoveSuccessMessage(''), 3000);
  };

  const handleDeleteDraft = (draftId) => {
    setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
    setScheduledDrafts(prevScheduled => prevScheduled.filter(draft => draft.originalId !== draftId));
  };

  const openScheduleModal = (draft) => {
    setCurrentDraftForSchedule(draft);
    setShowScheduleModal(true);
    setScheduleDate('');
    setScheduleTime('');
    setRecipientEmail(userInfo.email);
  };

  const handleScheduleDraft = async () => {
    if (!scheduleDate || !scheduleTime || !recipientEmail) {
      setMoveSuccessMessage('Please fill all schedule fields!');
      setTimeout(() => setMoveSuccessMessage(''), 3000);
      return;
    }

    const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    const scheduledItem = {
      id: Date.now(),
      originalId: currentDraftForSchedule.id,
      content: currentDraftForSchedule.content,
      scheduledDate: scheduleDateTime,
      recipientEmail,
      status: 'scheduled'
    };

    setScheduledDrafts(prev => [...prev, scheduledItem]);
    
    // Update the original draft status
    setDrafts(prev => prev.map(draft => 
      draft.id === currentDraftForSchedule.id 
        ? { ...draft, status: 'scheduled' }
        : draft
    ));

    // Mock email scheduling
    await sendScheduledEmail(currentDraftForSchedule.content, scheduleDateTime, recipientEmail);
    
    setShowScheduleModal(false);
    setMoveSuccessMessage(`Draft scheduled for ${scheduleDateTime.toLocaleString()}!`);
    setTimeout(() => setMoveSuccessMessage(''), 3000);
  };

  const handleAddCollaborator = () => {
    if (!newCollabEmail) return;
    
    const newCollab = {
      id: Date.now(),
      name: newCollabEmail.split('@')[0],
      email: newCollabEmail,
      role: newCollabRole,
      avatar: newCollabEmail.substring(0, 2).toUpperCase()
    };
    
    setCollaborators(prev => [...prev, newCollab]);
    setNewCollabEmail('');
    setMoveSuccessMessage(`Collaborator ${newCollabEmail} added!`);
    setTimeout(() => setMoveSuccessMessage(''), 3000);
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators(prev => prev.filter(collab => collab.id !== id));
  };

  const renderDashboard = () => (
    <div className="flex-1 p-8 overflow-y-auto h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-lg">Ready to create amazing AI-powered content?</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('collaboration')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Users className="w-5 h-5" />
            Collaborate
          </button>
        </div>
      </div>

      {/* Central Try Out Section */}
      <div 
        onClick={() => setActiveView('conversations')}
        className="bg-white rounded-xl p-10 mb-10 border-2 border-gray-200 cursor-pointer hover:border-emerald-500 transition-colors shadow-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2 mb-4">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Create Your Next Content</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our templates, set your tone, and let AI craft personalized content that resonates with your audience.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Templates */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Templates</h3>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('templates');
                }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <p className="text-gray-600 mb-4">Choose from proven formats that drive engagement</p>
            <div className="space-y-2">
              {templates.slice(0, 3).map((template, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView('templates');
                  }}
                  className="w-full flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded-lg transition-colors text-gray-700"
                >
                  <div className={`w-2 h-2 rounded-full ${template.color}`}></div>
                  <span>{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tones */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Tone Analyzer</h3>
            </div>
            <p className="text-gray-600 mb-4">AI learns your voice for authentic content</p>
            <div className="grid grid-cols-2 gap-2">
              {tones.slice(0, 4).map((tone, index) => (
                <div key={index} className="text-center p-2 bg-gray-100 rounded-lg">
                  <div className="text-lg mb-1">{tone.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{tone.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">LinkedIn Post Created</h4>
              <p className="text-sm text-gray-600">Generated professional content about AI trends</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Team Collaboration</h4>
              <p className="text-sm text-gray-600">Sarah added feedback to your Twitter thread draft</p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Content Scheduled</h4>
              <p className="text-sm text-gray-600">5 posts scheduled for next week across platforms</p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConversations = () => (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
              <p className="text-sm text-gray-600">How can I help you today?</p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-lg p-4 ${
              message.type === 'user' 
                ? 'bg-emerald-600 text-white ml-12' 
                : 'bg-gray-100 border border-gray-200 text-gray-800 mr-12'
            }`}>
              {message.image && (
                <img src={message.image} alt="Uploaded" className="max-w-xs rounded-lg mb-2" />
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">
                  <button
                    onClick={() => handleCopyMessage(message.content)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleMoveToDrafts(message)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Move to Drafts
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mr-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-gray-600 ml-2">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-4">
          <button
            onClick={handleImageUpload}
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition-colors"
            title="Upload Image"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleImageUpload}
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition-colors"
            title="Add Image"
          >
            <Image className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message AI Assistant... (Press Enter to send)"
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI can make mistakes. Verify important information. 0 / 4000 • GPT-4
        </div>
      </div>
    </div>
  );

  const renderDrafts = () => (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Final Drafts</h2>
        <div className="text-sm text-gray-600">
          {drafts.length} draft{drafts.length !== 1 ? 's' : ''} • {scheduledDrafts.length} scheduled
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No drafts yet</p>
          <p className="text-gray-500 text-sm">Messages you move to drafts will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {draft.timestamp.toLocaleString()}
                  </span>
                  {draft.status === 'scheduled' && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                      Scheduled
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openScheduleModal(draft)}
                    className="text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Schedule"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">{draft.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Drafts Section */}
      {scheduledDrafts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Content</h3>
          <div className="space-y-4">
            {scheduledDrafts.map((scheduled) => (
              <div key={scheduled.id} className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700 font-medium">
                      Scheduled for {scheduled.scheduledDate.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-emerald-600">
                    To: {scheduled.recipientEmail}
                  </div>
                </div>
                <div className="text-gray-800 whitespace-pre-wrap text-sm">
                  {scheduled.content.length > 200 
                    ? scheduled.content.substring(0, 200) + '...' 
                    : scheduled.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCollaboration = () => (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Collaboration</h2>
            <p className="text-gray-600">Manage team access and work together on content</p>
          </div>
          <button
            onClick={() => setShowCollabModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Add Collaborator
          </button>
        </div>

        {/* Collaboration Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Share className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Share Drafts</h3>
            <p className="text-gray-600 text-sm">Grant team members access to view and edit your final drafts</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Feedback</h3>
            <p className="text-gray-600 text-sm">Get instant comments and suggestions on your content</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Role-based Access</h3>
            <p className="text-gray-600 text-sm">Control who can view, edit, or manage your content</p>
          </div>
        </div>

        {/* Current Collaborators */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Team Members</h3>
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                    {collaborator.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{collaborator.name}</h4>
                    <p className="text-sm text-gray-600">{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    collaborator.role === 'Editor' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {collaborator.role}
                  </span>
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                    className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use Collaboration */}
        <div className="mt-8 bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">How to Use Collaboration</h3>
          <div className="space-y-3 text-emerald-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
              <div>
                <p className="font-medium">Add Team Members</p>
                <p className="text-sm text-emerald-600">Invite colleagues by email and assign them roles (Viewer or Editor)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
              <div>
                <p className="font-medium">Share Your Drafts</p>
                <p className="text-sm text-emerald-600">All team members can access drafts in the Final Drafts section based on their permissions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium">Get Feedback</p>
                <p className="text-sm text-emerald-600">Editors can modify content, while Viewers can leave comments and suggestions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
              <div>
                <p className="font-medium">Schedule Together</p>
                <p className="text-sm text-emerald-600">Team members can help schedule content and receive email notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Collaborator Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Collaborator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newCollabEmail}
                  onChange={(e) => setNewCollabEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newCollabRole}
                  onChange={(e) => setNewCollabRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Viewer">Viewer - Can view and comment</option>
                  <option value="Editor">Editor - Can view, edit and comment</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCollabModal(false);
                  setNewCollabEmail('');
                  setNewCollabRole('Viewer');
                }}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddCollaborator();
                  setShowCollabModal(false);
                }}
                disabled={!newCollabEmail}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Collaborator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderScheduler = () => (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Content Scheduler</h2>
      
      {scheduledDrafts.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No scheduled content</p>
          <p className="text-gray-500 text-sm">Schedule drafts to send them automatically</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledDrafts.map((scheduled) => (
            <div key={scheduled.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Scheduled for {scheduled.scheduledDate.toLocaleDateString()} at {scheduled.scheduledDate.toLocaleTimeString()}
                    </h4>
                    <p className="text-sm text-gray-600">To: {scheduled.recipientEmail}</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                  Scheduled
                </span>
              </div>
              <div className="text-gray-700 text-sm bg-gray-50 rounded-lg p-4">
                {scheduled.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="flex-1 p-8 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-600">This section is coming soon!</p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'conversations':
        return renderConversations();
      case 'drafts':
        return renderDrafts();
      case 'templates':
        return renderPlaceholder('Templates');
      case 'scheduler':
        return renderScheduler();
      case 'collaboration':
        return renderCollaboration();
      case 'settings':
        return renderPlaceholder('Settings');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden shadow-lg`}>
          <div className="p-6 h-full overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">CloutCraft</span>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-semibold mb-6 transition-colors"
            >
              + New Chat
            </button>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeView === item.id 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <div>
                  <div className="font-medium text-gray-800">{userInfo.name}</div>
                  <div className="text-sm text-gray-600">Pro Member</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden bg-white">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <span className="font-bold text-gray-800">CloutCraft</span>
            </div>
          </div>

          {/* Success Message */}
          {moveSuccessMessage && (
            <div className="mx-4 mt-2 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-sm">
              {moveSuccessMessage}
            </div>
          )}

          {/* Main Content */}
          {renderMainContent()}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Preview</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                  {currentDraftForSchedule?.content}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Email To</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setCurrentDraftForSchedule(null);
                }}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleDraft}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}