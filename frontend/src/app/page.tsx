'use client';

import { useChat } from '@/hooks/useChat';
import { JoinScreen } from '@/components/JoinScreen';
import { ChatRoom } from '@/components/ChatRoom';

export default function Home() {
  const { messages, onlineUsers, status, currentUser, error, join, sendMessage } = useChat();

  if (status === 'joined' && currentUser) {
    return (
      <ChatRoom
        messages={messages}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
        onSendMessage={sendMessage}
      />
    );
  }

  return (
    <JoinScreen
      onJoin={join}
      error={error}
      isConnecting={status === 'connecting'}
    />
  );
}
