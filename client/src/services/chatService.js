import api from './api';

// Get the student's own conversation (or create it)
const getMyConversation = async () => {
  const { data } = await api.get('/chat/my-conversation');
  return data;
};

// Get all conversations (for admin)
const getAllConversations = async () => {
  const { data } = await api.get('/chat/conversations');
  return data;
};

// Get messages for a specific conversation
const getMessagesForConversation = async (conversationId) => {
  const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
  return data;
};

export const chatService = {
  getMyConversation,
  getAllConversations,
  getMessagesForConversation,
};
