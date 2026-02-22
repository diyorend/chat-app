'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, User, ConnectionStatus } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, { autoConnect: false });
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
      setError(null);
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
      setCurrentUser(null);
    });

    socket.on('connect_error', () => {
      setError('Cannot connect to server');
      setStatus('disconnected');
    });

    socket.on('user:joined', (data: { user: User; messages: Message[]; onlineUsers: User[] }) => {
      setCurrentUser(data.user);
      setMessages(data.messages);
      setOnlineUsers(data.onlineUsers);
      setStatus('joined');
    });

    socket.on('user:entered', (data: { username: string; onlineUsers: User[] }) => {
      setOnlineUsers(data.onlineUsers);
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          username: '__system__',
          text: `${data.username} joined the chat`,
          timestamp: Date.now(),
        },
      ]);
    });

    socket.on('user:left', (data: { username: string; onlineUsers: User[] }) => {
      setOnlineUsers(data.onlineUsers);
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          username: '__system__',
          text: `${data.username} left the chat`,
          timestamp: Date.now(),
        },
      ]);
    });

    socket.on('message:new', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    socket.connect();
    setStatus('connecting');

    return () => {
      socket.disconnect();
    };
  }, []);

  const join = useCallback((username: string) => {
    setError(null);
    socketRef.current?.emit('user:join', { username });
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    socketRef.current?.emit('message:send', { text });
  }, []);

  return { messages, onlineUsers, status, currentUser, error, join, sendMessage };
}
