import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  @IsArray()
  permissions: mongoose.Schema.Types.ObjectId[];
}
