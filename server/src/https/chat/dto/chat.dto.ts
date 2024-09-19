import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  idUser: string;

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
