import React, { useState, useEffect, useRef } from 'react';

const AdminChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'User', text: 'Hello, how can I help you?' },
    { id: 2, sender: 'Admin', text: 'Hi! I have a question about the schedule.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message = {
      id: messages.length + 1,
      sender: 'Admin',
      text: newMessage.trim(),
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '400px', height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '8px', textAlign: msg.sender === 'Admin' ? 'right' : 'left' }}>
            <div style={{ display: 'inline-block', padding: '8px', borderRadius: '10px', backgroundColor: msg.sender === 'Admin' ? '#007bff' : '#e5e5ea', color: msg.sender === 'Admin' ? '#fff' : '#000' }}>
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

export default AdminChatWindow;
