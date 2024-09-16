import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  @IsArray()
  members: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty()
  isPrivate: boolean;
}
