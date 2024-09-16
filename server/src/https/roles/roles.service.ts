import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleModel.create(createRoleDto);
  }

  findAll() {
    return this.roleModel.find();
  }

  async findOne(id: number) {
    return;
  }
  async findByName(name) {
    return await this.roleModel
      .findOne({ name })
      .populate({
        path: 'permissions',
        select: { method: 1, path: 1, _id: 0 },
      });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
