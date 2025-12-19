import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'User password' })
  @IsString()
  password: string;
}
