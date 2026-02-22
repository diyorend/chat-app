import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.chatService.removeUser(client.id);
    if (user) {
      this.server.emit('user:left', {
        username: user.username,
        onlineUsers: this.chatService.getOnlineUsers(),
      });
      console.log(`${user.username} disconnected`);
    }
  }

  @SubscribeMessage('user:join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string },
  ) {
    const username = data.username?.trim().slice(0, 30);

    if (!username || username.length < 1) {
      client.emit('error', { message: 'Username is required' });
      return;
    }

    if (this.chatService.isUsernameTaken(username)) {
      client.emit('error', { message: 'Username is already taken' });
      return;
    }

    const user = this.chatService.addUser(client.id, username);
    const recentMessages = this.chatService.getRecentMessages();
    const onlineUsers = this.chatService.getOnlineUsers();

    // Send history to the joining user
    client.emit('user:joined', {
      user,
      messages: recentMessages,
      onlineUsers,
    });

    // Notify others
    client.broadcast.emit('user:entered', {
      username: user.username,
      onlineUsers,
    });

    console.log(`${username} joined the chat`);
  }

  @SubscribeMessage('message:send')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { text: string },
  ) {
    const user = this.chatService.getUser(client.id);
    if (!user) {
      client.emit('error', { message: 'You must join first' });
      return;
    }

    const text = data.text?.trim();
    if (!text) return;

    const message = this.chatService.addMessage(user.username, text);
    this.server.emit('message:new', message);
  }
}
