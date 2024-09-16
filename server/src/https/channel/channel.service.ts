import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from './schemas/channel.shema';
import { Model, PipelineStage } from 'mongoose';
import { ChatDocument } from '../chats/schemas/chat.schema';
import { IUser } from '../users/users.interface';
import { GetListChannelDto } from './dto/get-list-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private chatModel: Model<ChatDocument>,
  ) {}

  async create(createChannelDto: CreateChannelDto, user: IUser) {
    const { refreshToken, ...userInfo } = user;
    await this.chatModel.create({
      ...createChannelDto,
      admin: [userInfo],
    });
    return 'This action adds a new channel';
  }

  // async findAll(qs: GetListChannelDto) {
  //   const {
  //     current,
  //     limit,
  //     name,
  //   } = qs;
  //   // Tạo object để sắp xếp theo trường nếu field được truyền
  //   const search = {
  //     ...(address && { address: { $regex: address, $options: 'i' } }),
  //     ...(email && { email: { $regex: email, $options: 'i' } }),
  //     ...(name && { name: { $regex: name, $options: 'i' } }),
  //     // ...(age && { age: Number(age) }),
  //     ...(age && { age: { $gte: 0, $lte: age } }),
  //     ...(phoneNumber && {
  //       phoneNumber: { $regex: phoneNumber, $options: 'i' },
  //     }),
  //     ...(profession && { profession: { $regex: profession, $options: 'i' } }),
  //   };
  //   let sortStage = {};
  //   if (field && (sort === 1 || sort === -1)) {
  //     sortStage[field] = sort; // Nếu có truyền sortField và sortOrder hợp lệ
  //   }

  //   const pipeline: PipelineStage[] = [
  //     {
  //       $match: search,
  //     },
  //     ...(Object.keys(sortStage).length > 0 ? [{ $sort: sortStage }] : []),
  //     // { $skip: limit * (current - 1) },
  //     // { $limit: limit },
  //     {
  //       $facet: {
  //         data: [
  //           { $skip: limit * (current - 1) }, // Bỏ qua tài liệu để phân trang
  //           { $limit: limit },
  //         ],
  //         totalCount: [{ $count: 'count' }],
  //       },
  //     },
  //   ];
  //   const aggregate = this.customerModel.aggregate(pipeline);
  //   await utils.LogExecutionStats(aggregate);
  //   const result = await aggregate;

  //   const data = result[0].data || [];

  //   const totalCount = result[0].totalCount[0]?.count || 0;

  //   const totalPages = Math.ceil(totalCount / limit);

  //   return {
  //     meta: {
  //       current,
  //       pageSize: limit,
  //       pages: totalPages,
  //       total: totalCount,
  //     },
  //     result: data,
  //   };
  // }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
