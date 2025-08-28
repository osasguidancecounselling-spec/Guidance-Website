import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';
import ChatInterface from '../../components/chat/ChatInterface';

const AdminChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (message) => {
    try {
      if (selectedConversation) {
        await chatService.sendMessage({
          text: message,
          conversationId: selectedConversation._id,
        });
      }
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Chat</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Conversations</h3>
          {conversations.length === 0 ? (
            <p>No conversations found.</p>
          ) : (
            <ul>
              {conversations.map((conv) => (
                <li key={conv._id}>
                  <button onClick={() => handleSelectConversation(conv)}>
                    {conv.participants.map(p => p.name).join(', ')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ flex: 2 }}>
          {selectedConversation ? (
            <div>
              <h3>Chat with {selectedConversation.participants.map(p => p.name).join(', ')}</h3>
              <ChatInterface onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <p>Select a conversation to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
