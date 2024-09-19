import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './schemas/channel.shema';
import { Model, PipelineStage } from 'mongoose';
import { IUser } from '../users/users.interface';
import { GetListChannelDto } from './dto/get-list-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async create(createChannelDto: CreateChannelDto, user: IUser) {
    await this.channelModel.create(createChannelDto);
    return 'This action adds a new channel';
  }

  async findAll(qs: GetListChannelDto) {
    const { current, limit, name } = qs;
    const search = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
    };
    const pipeline: PipelineStage[] = [
      {
        $match: search,
      },
      {
        // Lookup để lấy lastMessage từ collection Chat
        $lookup: {
          from: 'chats', // Tên collection Chat trong MongoDB
          localField: 'lastMessage', // Trường lastMessage trong Channel
          foreignField: '_id', // Liên kết với _id của Chat
          as: 'lastMessage',
        },
      },
      {
        // Lấy tin nhắn cuối cùng, chỉ cần phần tử đầu tiên của mảng
        $addFields: {
          lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
        },
      },
      {
        // Lookup để lấy thông tin admins khi isGroup = false
        $lookup: {
          from: 'users', // Tên collection User
          localField: 'admins', // Trường admins chứa ObjectId của User
          foreignField: '_id', // Liên kết với _id của User
          as: 'participants', // Đưa kết quả lookup vào trường participants
          pipeline: [
            {
              $project: {
                _id: 1, // Chỉ lấy trường _id
                username: 1, // Lấy trường name
                image: 1, // Lấy trường image
              },
            },
          ],
        },
      },

      {
        $facet: {
          data: [
            { $skip: limit * (current - 1) },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                createdAt: 1,
                updatedAt: 1,
                image: 1,
                isGroup: 1,
                chatId: 1,
                lastMessage: 1,
                // Nếu isGroup là true, trả về nameGroup
                nameGroup: {
                  $cond: {
                    if: { $eq: ['$isGroup', true] },
                    then: '$nameGroup',
                    else: null,
                  },
                },
                // Nếu isGroup là false, trả về admins và participants
                admins: {
                  $cond: {
                    if: { $eq: ['$isGroup', false] },
                    then: '$admins',
                    else: null,
                  },
                },
                participants: {
                  $cond: {
                    if: { $eq: ['$isGroup', false] },
                    then: '$participants',
                    else: null,
                  },
                },
              },
            },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];
    const aggregate = this.channelModel.aggregate(pipeline);
    const result = await aggregate;

    const data = result[0].data || [];

    const totalCount = result[0].totalCount[0]?.count || 0;

    const totalPages = Math.ceil(totalCount / limit);

    return {
      meta: {
        current,
        pageSize: limit,
        pages: totalPages,
        total: totalCount,
      },
      result: data,
    };
  }

  async findOne(id: string) {
    return await this.channelModel.findById(id);
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
