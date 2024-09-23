import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import utils from 'src/common/utils';
import { RequestListUserDto } from './dto/request-list-user.dto';
import { IUser } from './users.interface';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.userModel.create(createUserDto);
  }

  async findAll(qs: RequestListUserDto, currentUser: IUser) {
    const { current = 1, limit = 10, notIncludeMySelf } = qs;
    const filter: any = {};

    // Nếu includeMySelf là false, thêm điều kiện để loại bỏ currentUser
    if (notIncludeMySelf) {
      filter._id = { $ne: currentUser._id };
    }
    const allUser = await this.userModel
      .find(filter)
      .select(['-password', '-refreshToken'])
      .skip((current - 1) * limit) // Phân trang
      .limit(limit) // Giới hạn số lượng kết quả
      .lean();
    return allUser;
  }

  findByUserName(username: string) {
    return this.userModel.findOne({
      username,
    });
  }

  findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('not found user');
    const user = this.userModel.findById(id).exec();
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
