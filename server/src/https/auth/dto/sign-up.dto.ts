import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from 'src/https/roles/roles.enum';
export class SignUpDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(RolesEnum)
  @IsOptional()
  role?: RolesEnum;

  @IsOptional()
  image?: string;
}
