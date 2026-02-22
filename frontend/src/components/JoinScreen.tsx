'use client';

import { useState, FormEvent } from 'react';
import styles from './JoinScreen.module.css';

interface JoinScreenProps {
  onJoin: (username: string) => void;
  error: string | null;
  isConnecting: boolean;
}

export function JoinScreen({ onJoin, error, isConnecting }: JoinScreenProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 1) return;
    onJoin(trimmed);
  };

  return (
    <div className={styles.container}>
      <div className={styles.noise} />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.dot} />
          <span className={styles.label}>livechat_v1.0</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.prompt}>~/</span>
          enter
          <br />
          the room
        </h1>

        <p className={styles.subtitle}>
          No signup. No tracking. Just pick a name and start talking.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrap}>
            <span className={styles.inputPrefix}>user@chat:~$</span>
            <input
              type="text"
              className={styles.input}
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {error && <p className={styles.error}>⚠ {error}</p>}

          <button
            type="submit"
            className={styles.button}
            disabled={isConnecting || username.trim().length < 1}
          >
            {isConnecting ? (
              <span className={styles.loading}>connecting<span className={styles.dots}>...</span></span>
            ) : (
              '→ join chat'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerItem}>⚡ websocket</span>
          <span className={styles.footerItem}>🔒 ephemeral</span>
          <span className={styles.footerItem}>◉ public room</span>
        </div>
      </div>
    </div>
  );
}
