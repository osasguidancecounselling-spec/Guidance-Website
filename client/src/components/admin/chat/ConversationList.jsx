import React from 'react';

const ConversationList = ({ conversations, onSelectConversation, selectedConversationId }) => {
  return (
    <div className="conversation-list">
      {conversations.map(conversation => (
        <div
          key={conversation._id}
          className={`conversation-item ${selectedConversationId === conversation._id ? 'selected' : ''}`}
          onClick={() => onSelectConversation(conversation)}
        >
          <p>{conversation.title}</p>
          <p>{conversation.lastMessage?.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
