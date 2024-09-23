import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import mongoose, { Model, PipelineStage, Types } from 'mongoose';
import { RequestListChatDto } from './dto/request-list-message.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async addMessage(createMessageDto: ChatDto) {
    try {
      const newMessage = await this.chatModel.create(createMessageDto);
      return newMessage;
    } catch (err) {
      throw err;
    }
  }

  async findAll(qs: RequestListChatDto, channelId: string) {
    const { current = 1, limit = 400 } = qs;
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $and: [
            { channelId: new Types.ObjectId(channelId) }, // Kiểm tra user có trong admins
          ],
        },
      },
      {
        $facet: {
          data: [{ $skip: limit * (current - 1) }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];
    const result = await this.chatModel.aggregate(pipeline);
    const data = result[0].data || [];

    const totalCount = result[0].totalCount[0]?.count || 0;

    const totalPages = Math.ceil(totalCount / limit);
    // Trả về dữ liệu
    return {
      meta: {
        current,
        pageSize: limit,
        pages: totalPages,
        total: totalCount,
      },
      result: data, // Dữ liệu của trang hiện tại
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
