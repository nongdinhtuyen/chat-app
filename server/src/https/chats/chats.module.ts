import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
