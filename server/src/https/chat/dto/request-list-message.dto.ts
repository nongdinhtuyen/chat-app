import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RequestListChatDto {
  @IsOptional()
  @Type(() => Number)
  current?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
