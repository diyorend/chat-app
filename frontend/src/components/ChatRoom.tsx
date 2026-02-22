'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Message, User } from '@/types';
import styles from './ChatRoom.module.css';

interface ChatRoomProps {
  messages: Message[];
  onlineUsers: User[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function ChatRoom({ messages, onlineUsers, currentUser, onSendMessage }: ChatRoomProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.dot} />
          <span>online</span>
          <span className={styles.count}>{onlineUsers.length}</span>
        </div>
        <ul className={styles.userList}>
          {onlineUsers.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <span className={styles.userDot} />
              <span className={user.id === currentUser.id ? styles.youLabel : ''}>
                {user.username}
                {user.id === currentUser.id && <span className={styles.youBadge}> (you)</span>}
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.sidebarFooter}>
          <div className={styles.roomInfo}>
            <span className={styles.roomName}># general</span>
            <span className={styles.roomDesc}>public room</span>
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.hash}>#</span>
            <span className={styles.roomTitle}>general</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.wsIndicator}>
              <span className={styles.wsDot} />
              ws connected
            </span>
          </div>
        </header>

        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.empty}>
              <span>No messages yet. Say hello!</span>
            </div>
          )}
          {messages.map((msg, idx) => {
            if (msg.username === '__system__') {
              return (
                <div key={msg.id} className={styles.systemMsg}>
                  <span className={styles.systemText}>{msg.text}</span>
                </div>
              );
            }

            const isOwn = msg.username === currentUser.username;
            const prevMsg = messages[idx - 1];
            const showUsername =
              !prevMsg ||
              prevMsg.username !== msg.username ||
              msg.timestamp - prevMsg.timestamp > 60000;

            return (
              <div key={msg.id} className={`${styles.msgGroup} ${isOwn ? styles.ownMsg : ''}`}>
                {showUsername && (
                  <div className={styles.msgMeta}>
                    <span className={`${styles.msgUsername} ${isOwn ? styles.ownUsername : ''}`}>
                      {msg.username}
                    </span>
                    <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <div className={styles.msgBubble}>
                  <span className={styles.msgText}>{msg.text}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputArea}>
          <span className={styles.inputPrompt}>{currentUser.username}@chat:~$</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type a message..."
            maxLength={1000}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
            ↵
          </button>
        </form>
      </main>
    </div>
  );
}
