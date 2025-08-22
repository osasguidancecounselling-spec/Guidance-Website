import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../contexts/ChatProvider';
import { chatService } from '../../services/chatService';
import './StudentChatPage.css';

const StudentChatPage = () => {
  const { user } = useAuth();
  const { socket } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const convRes = await chatService.getMyConversation();
        const currentConversationId = convRes.data._id;
        setConversationId(currentConversationId);

        const messagesRes = await chatService.getMessagesForConversation(currentConversationId);
        setMessages(messagesRes.data);

        if (socket) {
          socket.emit('joinConversation', currentConversationId);
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && socket) {
      fetchConversation();
    }
  }, [user, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.conversation === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, conversationId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user && socket && conversationId) {
      socket.emit('sendMessage', {
        conversationId,
        senderId: user.id,
        text: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-window">
        <div className="chat-header">
          <h3>Chat with Administrator</h3>
        </div>
        <div className="chat-messages">
          {loading ? (
            <p className="chat-info">Loading chat history...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-bubble ${msg.sender._id === user.id ? 'sent' : 'received'}`}
              >
                <div className="message-sender">
                  {msg.sender._id === user.id ? 'You' : msg.sender.name}
                </div>
                <div className="message-text">{msg.text}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default StudentChatPage;
