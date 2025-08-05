import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Placeholder({ title }) {
  return (
    <div className="flex-1 p-8 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
          <Sparkles className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-500">This section is coming soon!</p>
      </div>
    </div>
  );
}