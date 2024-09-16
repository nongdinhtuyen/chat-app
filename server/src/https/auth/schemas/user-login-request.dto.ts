import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'Password', example: 'YWRtaW4xMjM0' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'Username', example: 'admintest@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly username: string;
}
