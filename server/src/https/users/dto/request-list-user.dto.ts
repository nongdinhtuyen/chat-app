import { Transform, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolesEnum } from 'src/https/roles/roles.enum';

export class RequestListUserDto {
  @IsOptional()
  @Type(() => Number)
  current?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(RolesEnum, {
    message: 'role must be one of the following values: user, admin',
  })
  role: string;

  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  notIncludeMySelf?: boolean;
}
