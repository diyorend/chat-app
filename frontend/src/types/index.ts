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

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'joined';
