import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Send, Copy, ArrowRight, Image, X } from 'lucide-react';
import { generateText } from '../Service/ollamaservices'; // Import the new service function

// Now accepting handleMoveToDrafts and initialPrompt as props
export default function Conversations({ handleMoveToDrafts, initialPrompt }) {
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]); // State for chat messages, now internal
  const [inputValue, setInputValue] = useState(''); // State for the input field, now internal
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator, now internal
  const [imageFile, setImageFile] = useState(null); // State for image file, now internal

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to set initial input value from template click
  useEffect(() => {
    if (initialPrompt) {
      setInputValue(`-/${initialPrompt} -> `);
    }
  }, [initialPrompt]);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !imageFile) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      image: imageFile,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setImageFile(null);
    setIsLoading(true);

    try {
      // Using default settings without tone and temperature controls
      const aiResponse = await generateText(inputValue, "mistral", "neutral", 0.7);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now() + 1, type: 'assistant', content: `Error: ${error.message}. Please ensure Ollama is running and the model ('mistral') is pulled.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated copy function to use modern clipboard API
  const handleCopyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Text copied to clipboard!');
      // You could add a toast notification here
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Text copied to clipboard!');
    }
  };

  // Enhanced move to drafts function
  const handleMoveToDraftsClick = (message) => {
    if (handleMoveToDrafts && typeof handleMoveToDrafts === 'function') {
      handleMoveToDrafts({
        ...message,
        timestamp: new Date().toISOString(),
        movedFromChat: true
      });
      console.log('Message moved to drafts:', message.content);
      // You could add a toast notification here
    } else {
      console.error('handleMoveToDrafts function not provided or not a function');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setImageFile(null);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white font-sans h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-500">How can I help you today?</p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Ask me anything to get started!</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-xl p-4 shadow-sm ${
              message.type === 'user'
                ? 'bg-emerald-500 text-white ml-12'
                : 'bg-gray-100 border border-gray-200 text-gray-900 mr-12'
            }`}>
              {message.image && (
                <img
                  src={URL.createObjectURL(message.image)}
                  alt="User upload"
                  className="max-h-48 rounded-lg mb-4 object-cover w-full"
                />
              )}
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">
                  <button
                    onClick={() => handleCopyMessage(message.content)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-500 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleMoveToDraftsClick(message)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-500 transition-colors"
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
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mr-12 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section - Fixed at bottom */}
      <div className="p-6 border-t border-gray-200 bg-white shadow-lg flex-shrink-0">
        {imageFile && (
          <div className="relative mb-4">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="max-h-32 rounded-lg object-cover"
            />
            <button
              onClick={() => setImageFile(null)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message AI Assistant..."
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner resize-none min-h-[56px] max-h-32"
            disabled={isLoading}
            rows={1}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
            accept="image/*"
          />
          <button
            onClick={handleFileButtonClick}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-lg transition-colors text-gray-600 shadow-md flex-shrink-0"
            disabled={isLoading}
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && !imageFile) || isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg transition-colors text-white shadow-md flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI can make mistakes. Verify important information. Press Shift+Enter for new line.
        </div>
      </div>
    </div>
  );
}