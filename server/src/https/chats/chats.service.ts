import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async createMessage(createMessageDto: ChatDto) {
    const newMessage = await this.chatModel.create(createMessageDto);
    return newMessage;
  }

  findAll() {
    return 'hehe';
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
