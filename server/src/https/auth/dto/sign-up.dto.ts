import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from 'src/main/roles/roles.enum';
export class SignUpDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(RolesEnum)
  @IsOptional()
  role?: RolesEnum;
}
