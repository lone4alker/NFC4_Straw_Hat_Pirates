import React from 'react';
import { FileText, Zap, Sparkles } from 'lucide-react';

// Accept setActiveView as a prop from the parent component
export default function Templates({ setActiveView }) {
  const templates = [
    {
      title: 'LinkedIn Post',
      description: 'Craft a professional and engaging post for your LinkedIn network.',
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      color: 'bg-emerald-50',
      // You can add a specific prompt or type here if you want to pre-fill the conversation
      // prompt: 'Write a professional LinkedIn post about [topic].',
    },
    {
      title: 'Twitter Thread',
      description: 'Create a compelling and viral-worthy thread to tell a story or share insights.',
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50',
      // prompt: 'Generate a Twitter thread about [topic] with 5 tweets.',
    },
    {
      title: 'Product Launch Announcement',
      description: 'Generate a polished announcement for your new product or feature.',
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      color: 'bg-yellow-50',
      // prompt: 'Write a product launch announcement for our new [product name] that [key feature].',
    },
    {
      title: 'Customer Testimonial',
      description: 'Write a powerful testimonial based on customer feedback to build trust.',
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-50',
      // prompt: 'Draft a customer testimonial for [product/service] based on this feedback: "[customer feedback]".',
    },
  ];

  // Function to handle template click
  const handleTemplateClick = (templateTitle) => {
    // Navigate to the 'conversations' view when a template is clicked
    if (setActiveView) {
      // Pass the template title to the conversations component
      setActiveView('conversations', templateTitle);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Templates</h2>
      <p className="text-gray-500 text-lg mb-8">
        Jumpstart your content creation with these pre-designed templates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div
            key={index}
            // Add the onClick handler here, passing the template title
            onClick={() => handleTemplateClick(template.title)}
            className={`p-6 rounded-xl border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 ${template.color}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm">
                {template.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{template.title}</h3>
            </div>
            <p className="text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
