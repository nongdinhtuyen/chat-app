import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}
  async create(createTaskDto: CreateTaskDto) {
    const newTask = await this.taskModel.create({ ...createTaskDto });
    return newTask;
  }

  findAll() {
    return this.taskModel.find({}).lean();
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(ids: string[], updateTaskDto: UpdateTaskDto) {
    await this.taskModel.find(ids);
    return `This action updates a #${ids} task`;
  }

  async remove(ids: string[]) {
    await this.taskModel.deleteMany({ _id: { $in: ids } });
    return `This action removes a #${ids} task`;
  }
}
