import React from 'react';
import { Send } from 'lucide-react';

const InputArea = ({ inputValue, setInputValue, handleSendMessage }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4 flex-shrink-0">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-300">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message AI Assistant... (Press Enter to send, Shift+Enter for new line)"
            className="w-full resize-none bg-transparent px-5 py-4 pr-14 focus:outline-none text-sm leading-relaxed placeholder-gray-500"
            rows="1"
            style={{ minHeight: '52px', maxHeight: '200px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 px-2 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>AI can make mistakes. Verify important information.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{inputValue.length} / 4000</span>
            <span>•</span>
            <span className="font-medium">GPT-4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
