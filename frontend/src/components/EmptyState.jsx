import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        How can I help you today?
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        I'm here to assist with questions, creative tasks, analysis, coding, and more. 
        What would you like to explore?
      </p>
    </div>
  );
};

export default EmptyState;
