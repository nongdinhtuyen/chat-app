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
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.userModel.create(createUserDto);
  }

  async findAll() {
    const allUser = await this.userModel
      .find()
      .select(['-password', '-refreshToken'])
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
