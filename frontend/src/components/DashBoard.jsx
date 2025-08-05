import React from 'react';
import { 
  BarChart3,
  Users,
  Zap,
  FileText,
  Palette,
  Calendar
} from 'lucide-react';

export default function Dashboard({ setActiveView }) {
  const templates = [
    { title: 'LinkedIn Post', type: 'Professional', color: 'bg-emerald-500' },
    { title: 'Twitter Thread', type: 'Engaging', color: 'bg-green-600' },
    { title: 'Startup Update', type: 'Business', color: 'bg-teal-600' },
  ];

  const tones = [
    { name: 'Professional', description: 'Formal and business-focused', icon: '💼' },
    { name: 'Casual', description: 'Friendly and conversational', icon: '😊' },
    { name: 'Inspiring', description: 'Motivational and uplifting', icon: '🚀' },
    { name: 'Educational', description: 'Informative and teaching', icon: '🎓' }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 text-lg">Ready to create amazing AI-powered content?</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('collaboration')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Users className="w-5 h-5" />
            Collaborate
          </button>
        </div>
      </div>

      <div 
        onClick={() => setActiveView('conversations')}
        className="bg-white rounded-xl p-10 mb-10 border border-gray-200 cursor-pointer hover:border-emerald-500 transition-colors"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500 rounded-lg px-6 py-2 mb-4 text-white">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Create Your Next Content</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our templates, set your tone, and let AI craft personalized content that resonates with your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Templates</h3>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('templates');
                }}
                className="text-emerald-500 hover:text-emerald-400 text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <p className="text-gray-600 mb-4">Choose from proven formats that drive engagement</p>
            <div className="space-y-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView('templates');
                  }}
                  className="w-full flex items-center gap-2 text-sm hover:bg-gray-200 p-2 rounded-lg transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${template.color}`}></div>
                  <span>{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Tone Analyzer</h3>
            </div>
            <p className="text-gray-600 mb-4">AI learns your voice for authentic content</p>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((tone, index) => (
                <div key={index} className="text-center p-2 bg-gray-200 rounded-lg">
                  <div className="text-lg mb-1">{tone.icon}</div>
                  <div className="text-xs font-medium text-gray-800">{tone.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">LinkedIn Post Created</h4>
              <p className="text-sm text-gray-500">Generated professional content about AI trends</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Team Collaboration</h4>
              <p className="text-sm text-gray-500">Sarah added feedback to your Twitter thread draft</p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Content Scheduled</h4>
              <p className="text-sm text-gray-500">5 posts scheduled for next week across platforms</p>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}