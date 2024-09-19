import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { RequestListChatDto } from './dto/request-list-message.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async createMessage(createMessageDto: ChatDto) {
    console.log(
      '🚀 ~ ChatService ~ createMessage ~ createMessageDto:',
      createMessageDto,
    );
    try {
      const newMessage = await this.chatModel.create(createMessageDto);
      return newMessage;
    } catch (err) {
      console.log('🚀 ~ ChatService ~ createMessage ~ err:', err);
      throw err;
    }
  }

  async findAll(qs: RequestListChatDto) {
    const { current = 1, limit = 20 } = qs;
    const skip = (current - 1) * limit;

    // Đếm tổng số bản ghi
    const totalCount = await this.chatModel.countDocuments();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalCount / limit);

    // Lấy các bản ghi cho trang hiện tại
    const chats = await this.chatModel
      .find()
      // .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự giảm dần của createdAt
      .skip(skip) // Bỏ qua các bản ghi đã nằm ở các trang trước
      .limit(limit) // Lấy số lượng bản ghi theo limit
      .exec();

    // Trả về dữ liệu
    return {
      meta: {
        current,
        pageSize: limit,
        pages: totalPages,
        total: totalCount,
      },
      result: chats, // Dữ liệu của trang hiện tại
    };
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
