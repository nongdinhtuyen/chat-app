import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RolesEnum } from 'src/https/roles/roles.enum';

export class RequestListPermissionDto {
  @IsOptional()
  @Type(() => Number)
  current?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(RolesEnum, {
    message: 'role must be one of the following values: user, admin',
  })
  role?: string;
}
