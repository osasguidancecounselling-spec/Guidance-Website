import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ChatBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim() === '') return;
    if (!user) {
      alert('You must be logged in to send messages.');
      return;
    }
    onSendMessage({
      text: message.trim(),
      senderId: user.id,
      senderName: user.name,
    });
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        style={{ flex: 1, padding: '8px' }}
      />
      <button onClick={handleSend} style={{ marginLeft: '8px', padding: '8px 12px' }}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
