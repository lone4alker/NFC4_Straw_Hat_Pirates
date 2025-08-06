import React, { useRef, useState } from 'react';
import { Sparkles, Send, Copy, ArrowRight, Image, X } from 'lucide-react';
import { generateText } from '../Service/ollamaservices'; // Import the new service function

// Now accepting handleMoveToDrafts as a prop
export default function Conversations({ handleMoveToDrafts }) { 
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState([]); // State for chat messages, now internal
  const [inputValue, setInputValue] = useState(''); // State for the input field, now internal
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator, now internal
  const [imageFile, setImageFile] = useState(null); // State for image file, now internal
  const [selectedTone, setSelectedTone] = useState('neutral'); // State for tone, now internal
  const [temperature, setTemperature] = useState(0.7); // State for temperature, now internal

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
      // Changed the model from "llama3.2" to "mistral"
      const aiResponse = await generateText(inputValue, "mistral", selectedTone, temperature);

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

  // Define handleCopyMessage internally as it's not passed as a prop
  const handleCopyMessage = (content) => {
    document.execCommand('copy', false, content);
    // Optional: Provide user feedback that text was copied
    console.log('Text copied to clipboard!');
  };

  // The handleMoveToDrafts function is now received via props from the parent component.
  // This ensures the correct logic for adding to drafts is used.

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setImageFile(null);
    setSelectedTone('neutral');
    setTemperature(0.7);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white font-sans">
      <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
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

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-xl p-4 shadow-sm ${
              message.type === 'user' 
                ? 'bg-emerald-500 text-white ml-12' 
                : 'bg-gray-100 border border-gray-200 text-gray-900 mr-12'
            }`}>
              {message.image && (
                <img src={URL.createObjectURL(message.image)} alt="User upload" className="max-h-48 rounded-lg mb-4 object-cover" />
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
                    onClick={() => handleMoveToDrafts(message)} // Now correctly using the prop
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
      </div>

      <div className="p-6 border-t border-gray-200 bg-white rounded-b-lg shadow-lg">
        {imageFile && (
          <div className="relative mb-4">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-h-32 rounded-lg object-cover" />
            <button 
              onClick={() => setImageFile(null)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex flex-col gap-4 mb-4">
          {/* Tone Selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="tone-select" className="text-gray-700 text-sm font-medium min-w-[60px]">Tone:</label>
            <select
              id="tone-select"
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              disabled={isLoading}
            >
              <option value="neutral">Neutral</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="humorous">Humorous</option>
              <option value="sarcastic">Sarcastic</option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="flex items-center gap-3">
            <label htmlFor="temperature-slider" className="text-gray-700 text-sm font-medium min-w-[60px]">Creativity:</label>
            <input
              type="range"
              id="temperature-slider"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-500 h-2 rounded-lg appearance-none cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-gray-700 text-sm font-medium w-8 text-right">{temperature.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message AI Assistant..."
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
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
            className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-lg transition-colors text-gray-600 shadow-md"
            disabled={isLoading}
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && !imageFile) || isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg transition-colors text-white shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}