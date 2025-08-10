import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Send, Copy, ArrowRight, Image, X } from 'lucide-react';
// Import both functions from the service file
import { generateWithGemini, analyzeImageWithGemini } from '../Service/apiService';

export default function Conversations({ handleMoveToDrafts, initialPrompt, userFilePath }) {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Restored for file input
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Restored state for image file

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      setInputValue(`-/${initialPrompt} -> `);
    }
  }, [initialPrompt]);

  // Main function to handle sending messages
  const handleSendMessage = async () => {
    // A message is valid if it has text OR an image
    if (!inputValue.trim() && !imageFile) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      image: imageFile, // Attach the file to the message object for preview
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setImageFile(null); // Clear the preview after sending
    setIsLoading(true);

    try {
      let aiResponse;
      // If an image is attached, call the image analysis API
      if (imageFile) {
        aiResponse = await analyzeImageWithGemini(userMessage.content, userMessage.image);
      } else {
        // Otherwise, call the standard text generation API
        aiResponse = await generateWithGemini(userMessage.content, userFilePath);
      }

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
        {
          id: Date.now() + 1,
          type: 'assistant',
          content: `Error: ${error.message}. Please check the server and API key.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for UI interaction
  const handleFileButtonClick = () => fileInputRef.current.click();
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setImageFile(file);
  };
  const handleCopyMessage = (content) => navigator.clipboard.writeText(content);
  const handleMoveToDraftsClick = (message) => handleMoveToDrafts?.({ ...message, timestamp: new Date().toISOString() });
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
          <button onClick={handleNewChat} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-xl p-4 shadow-sm ${message.type === 'user' ? 'bg-emerald-500 text-white ml-12' : 'bg-gray-100 border border-gray-200 text-gray-900 mr-12'}`}>
              {/* Restored: Show the image in the chat bubble if it exists */}
              {message.image && (
                <img
                  src={URL.createObjectURL(message.image)}
                  alt="User upload"
                  className="max-h-48 w-full rounded-lg mb-4 object-cover"
                  onLoad={() => URL.revokeObjectURL(message.image)} // Clean up object URL
                />
              )}
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">
                  <button onClick={() => handleCopyMessage(message.content)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-500 transition-colors">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button onClick={() => handleMoveToDraftsClick(message)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-500 transition-colors">
                    <ArrowRight className="w-3 h-3" /> Move to Drafts
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-6 border-t border-gray-200 bg-white shadow-lg flex-shrink-0">
        {/* Restored: Image preview above the text input */}
        {imageFile && (
          <div className="relative mb-4 w-fit">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-h-32 rounded-lg object-cover" />
            <button onClick={() => setImageFile(null)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={imageFile ? "Ask a question about the image..." : "Message AI Assistant..."}
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner resize-none min-h-[56px] max-h-32"
            disabled={isLoading}
            rows={1}
          />
          {/* Restored: Hidden file input and the button to trigger it */}
          <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} accept="image/*" />
          <button onClick={handleFileButtonClick} className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-lg transition-colors text-gray-600 shadow-md flex-shrink-0" disabled={isLoading}>
            <Image className="w-5 h-5" />
          </button>
          <button onClick={handleSendMessage} disabled={(!inputValue.trim() && !imageFile) || isLoading} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg transition-colors text-white shadow-md flex-shrink-0">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI can make mistakes. Press Shift+Enter for new line.
        </div>
      </div>
    </div>
  );
}