import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessages();
        setMessages(data);
      } catch (err) {
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const sentMessage = await chatService.sendMessage(newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '400px', height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '8px', textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>
            <div style={{ display: 'inline-block', padding: '8px', borderRadius: '10px', backgroundColor: msg.sender === 'admin' ? '#007bff' : '#e5e5ea', color: msg.sender === 'admin' ? '#fff' : '#000' }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '8px 12px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
