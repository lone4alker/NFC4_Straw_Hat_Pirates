// src/components/Message.jsx
import React, { useState } from 'react';
import { Bot, User, Copy, Check, ArrowRight } from 'lucide-react';

const Message = ({ message, onCopyMessage, onMoveToDrafts }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    onCopyMessage(message.content);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMoveToDrafts = () => {
    onMoveToDrafts(message);
  };

  return (
    <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.type === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className="max-w-2xl">
        <div
          className={`rounded-2xl px-5 py-4 ${
            message.type === 'user'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white border border-gray-200 shadow-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-2 px-1">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-all ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          {message.type === 'assistant' && (
            <button
              onClick={handleMoveToDrafts}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-md transition-all"
            >
              <ArrowRight size={12} />
              Move to Drafts
            </button>
          )}
        </div>
      </div>
      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default Message;
