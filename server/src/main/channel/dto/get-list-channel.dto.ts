import { Transform, Type } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetListChannelDto {
  @IsOptional()
  @Type(() => Number)
  current?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  name?: string;
}
