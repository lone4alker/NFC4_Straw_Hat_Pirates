import React from 'react';
import Message from './Message';
import EmptyState from './EmptyState';

const MessageArea = ({ messages, onCopyMessage, onMoveToDrafts }) => {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            onCopyMessage={onCopyMessage}
            onMoveToDrafts={onMoveToDrafts}
          />
        ))}
        
        {messages.length === 1 && <EmptyState />}
      </div>
    </div>
  );
};

export default MessageArea;
