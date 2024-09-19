import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { User } from 'src/https/users/schemas/user.schema';

export class CreateChannelDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  nameGroup: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  @IsArray()
  @ApiProperty()
  admins: mongoose.Schema.Types.ObjectId[];

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Boolean)
  isGroup: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  @Type(() => Boolean)
  image: string;

  @IsOptional()
  @IsMongoId({ each: true })
  @IsArray()
  @ApiProperty()
  members: mongoose.Schema.Types.ObjectId[];
}
