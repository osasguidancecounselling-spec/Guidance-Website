import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatProvider';

export const useChat = () => {
  return useContext(ChatContext);
};