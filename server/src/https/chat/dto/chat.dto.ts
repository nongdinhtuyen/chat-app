import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chatId: mongoose.Schema.Types.ObjectId;

  @Type(() => Number)
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
