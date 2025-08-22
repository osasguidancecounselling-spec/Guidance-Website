import React, { useState, useEffect, useCallback } from 'react';
import ConversationList from '../../components/admin/chat/ConversationList';
import AdminChatWindow from '../../components/admin/chat/AdminChatWindow';
import { chatService } from '../../services/chatService';
import { useChat } from '../../contexts/ChatProvider';
import './AdminChatPage.css';

const AdminChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { socket } = useChat();

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await chatService.getAllConversations();
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to fetch conversations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setConversations(prevConvos => {
        const updatedConvos = prevConvos.map(convo => {
          if (convo._id === message.conversation) {
            return { ...convo, lastMessage: message, updatedAt: message.createdAt };
          }
          return convo;
        });
        return updatedConvos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="chat-list-info">Loading conversations...</p>;
    }
    if (error) {
      return <p className="chat-list-info error">{error}</p>;
    }
    return (
      <ConversationList
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?._id}
      />
    );
  };

  return (
    <div className="admin-chat-page"> 
      <div className="chat-layout">
        <div className="conversation-list-container">
          {renderContent()}
        </div>
        <div className="chat-window-container">
          {selectedConversation ? (
            <AdminChatWindow conversation={selectedConversation} key={selectedConversation._id} />
          ) : (
            <div className="no-chat-selected">
              <i className="fas fa-comments welcome-icon"></i>
              <h3>Welcome to Admin Chat</h3>
              <p>Select a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;