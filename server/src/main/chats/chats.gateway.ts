import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatDto } from './dto/chat.dto';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from 'src/decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  handleEvent(client: Socket, data: ChatDto, @CurrentUser() user) {
    console.log('🚀 ~ ChatsGateway ~ handleEvent ~ user:', user);
    this.server.emit('chat', data);
    return data;
  }

  afterInit(server: Socket) {
    console.log('Server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const authHeader = client.handshake.headers['authorization'];
    if (authHeader) {
      try {
        const token = authHeader;
        const decoded = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_ACCESS_TOKEN'),
        });
        client.data = decoded;
      } catch (error) {
        console.log(error);

        client.emit('error', {
          message: 'Unauthorized',
        });
        // send error message to client
        client.disconnect();
      }
    } else {
      client.emit('error', {
        message: 'Unauthorized',
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
  }
}
