import React from 'react';
import { Menu, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignUp from "./sign";
import AuthForm from "./login";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
        </div>
        <button
          onClick={() => navigate('./signup')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Signup
        </button>
         <button
          onClick={() => navigate('./login')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </div>
      
    </div>
  );
};

export default Header;
