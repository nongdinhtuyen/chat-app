import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RequestListCustomerDto {
  @IsOptional()
  @Type(() => Number)
  current?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  age?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  field?: string;

  @IsIn([1, -1])
  @IsOptional()
  @Type(() => Number) // Chuyển đổi giá trị thành số
  sort?: number;
}
