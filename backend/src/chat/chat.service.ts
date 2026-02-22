import { Injectable } from '@nestjs/common';

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
}

@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private users: Map<string, User> = new Map();
  private readonly MAX_MESSAGES = 100;

  addUser(socketId: string, username: string): User {
    const user: User = { id: socketId, username };
    this.users.set(socketId, user);
    return user;
  }

  removeUser(socketId: string): User | undefined {
    const user = this.users.get(socketId);
    this.users.delete(socketId);
    return user;
  }

  getUser(socketId: string): User | undefined {
    return this.users.get(socketId);
  }

  getOnlineUsers(): User[] {
    return Array.from(this.users.values());
  }

  addMessage(username: string, text: string): Message {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      username,
      text: text.trim().slice(0, 1000),
      timestamp: Date.now(),
    };

    this.messages.push(message);

    // Keep only last MAX_MESSAGES
    if (this.messages.length > this.MAX_MESSAGES) {
      this.messages = this.messages.slice(-this.MAX_MESSAGES);
    }

    return message;
  }

  getRecentMessages(): Message[] {
    return this.messages.slice(-50);
  }

  isUsernameTaken(username: string): boolean {
    return Array.from(this.users.values()).some(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
  }
}
