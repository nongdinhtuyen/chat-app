import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolesEnum } from 'src/main/roles/roles.enum';

export class RequestListUserDto {
  page: number;

  limit: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(RolesEnum, {
    message: 'role must be one of the following values: user, admin',
  })
  role: string;
}
