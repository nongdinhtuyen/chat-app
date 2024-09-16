import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model, PipelineStage } from 'mongoose';
import { RequestListPermissionDto } from './dto/request-list-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    return await this.permissionModel.create(createPermissionDto);
  }

  async findAll(qs: RequestListPermissionDto) {
    const { current = 1, limit = 10, path, method, role } = qs;
    const search = {
      ...(path && { path: { $regex: path, $options: 'i' } }),
      ...(method && { method: { $regex: method, $options: 'i' } }),
      ...(role && { method: { $regex: role, $options: 'i' } }),
    };
    const pipeline: PipelineStage[] = [
      {
        $match: search,
      },
      {
        $facet: {
          data: [{ $skip: limit * (current - 1) }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];
    const result = await this.permissionModel.aggregate(pipeline).exec();
    const explain = await this.permissionModel.aggregate(pipeline).explain('executionStats');
    console.log("🚀 ~ PermissionsService ~ findAll ~ explain:", (explain.stages[0]))
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

  async findAllByRole(role) {
    return await this.permissionModel.find({ name: role });
  }

  async findOne(id: string) {
    return await this.permissionModel.findOne({ _id: id });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
