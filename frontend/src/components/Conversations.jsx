import React, { useRef } from 'react';
import { Sparkles, Send, Copy, ArrowRight, Image, X } from 'lucide-react';

export default function Conversations({ 
  messages, 
  inputValue, 
  setInputValue, 
  isLoading, 
  handleSendMessage,
  handleImageUpload,
  handleCopyMessage,
  handleMoveToDrafts,
  handleNewChat,
  imageFile,
  setImageFile
}) {
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-500">How can I help you today?</p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-lg p-4 ${
              message.type === 'user' 
                ? 'bg-emerald-500 text-white ml-12' 
                : 'bg-gray-100 border border-gray-200 text-gray-900 mr-12'
            }`}>
              {message.image && (
                <img src={URL.createObjectURL(message.image)} alt="User upload" className="max-h-48 rounded-lg mb-4" />
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
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
                    onClick={() => handleMoveToDrafts(message)}
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
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mr-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 bg-white">
        {imageFile && (
          <div className="relative mb-4">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-h-32 rounded-lg" />
            <button 
              onClick={() => setImageFile(null)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message AI Assistant..."
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            disabled={isLoading}
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
            className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-lg transition-colors text-gray-600"
            disabled={isLoading}
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && !imageFile) || isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg transition-colors text-white"
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
}