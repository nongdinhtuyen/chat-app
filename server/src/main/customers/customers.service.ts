import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { RequestListCustomerDto } from './dto/request-list-customer.dto';
import { Model, PipelineStage } from 'mongoose';
import { Customers, CustomersDocument } from './schemas/customer.schema';
import utils from 'src/common/utils';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customers.name)
    private customerModel: Model<CustomersDocument>,
  ) {}
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async findAll(qs: RequestListCustomerDto) {
    const {
      current,
      limit,
      address,
      age,
      email,
      name,
      phoneNumber,
      profession,
      sort,
      field,
    } = qs;
    // Tạo object để sắp xếp theo trường nếu field được truyền
    const search = {
      ...(address && { address: { $regex: address, $options: 'i' } }),
      ...(email && { email: { $regex: email, $options: 'i' } }),
      ...(name && { name: { $regex: name, $options: 'i' } }),
      // ...(age && { age: Number(age) }),
      ...(age && { age: { $gte: 0, $lte: age } }),
      ...(phoneNumber && {
        phoneNumber: { $regex: phoneNumber, $options: 'i' },
      }),
      ...(profession && { profession: { $regex: profession, $options: 'i' } }),
    };
    let sortStage = {};
    if (field && (sort === 1 || sort === -1)) {
      sortStage[field] = sort; // Nếu có truyền sortField và sortOrder hợp lệ
    }

    const pipeline: PipelineStage[] = [
      {
        $match: search,
      },
      ...(Object.keys(sortStage).length > 0 ? [{ $sort: sortStage }] : []),
      // { $skip: limit * (current - 1) },
      // { $limit: limit },
      {
        $facet: {
          data: [
            { $skip: limit * (current - 1) }, // Bỏ qua tài liệu để phân trang
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];
    const aggregate = this.customerModel.aggregate(pipeline);
    await utils.LogExecutionStats(aggregate);
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

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
