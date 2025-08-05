import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';

export default function Scheduler({ scheduledMessages }) {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-white">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Scheduler</h2>
            <p className="text-gray-600 text-lg mb-8">
                Your content is scheduled and ready to be posted.
            </p>

            {scheduledMessages.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No content is scheduled yet</p>
                    <p className="text-gray-400 text-sm">
                        Schedule a draft from the "Final Drafts" page to see it here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scheduledMessages.map((message) => (
                        <div key={message.id} className="bg-green-50 rounded-lg p-6 border border-green-200">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm text-green-700 font-semibold flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Scheduled for: {message.scheduledFor.toLocaleString()}
                                </span>
                            </div>
                            {message.image && (
                                <img 
                                    src={URL.createObjectURL(message.image)} 
                                    alt="Scheduled content" 
                                    className="max-w-full h-auto rounded-lg mb-4" 
                                />
                            )}
                            <div className="text-gray-900 whitespace-pre-wrap">{message.content}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}