import { Prop } from '@nestjs/mongoose';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { User } from 'src/https/users/schemas/user.schema';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  admin: User[];

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  @IsArray()
  members: mongoose.Schema.Types.ObjectId[];
}
