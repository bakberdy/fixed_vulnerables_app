import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'freelancer', enum: ['client', 'freelancer'], description: 'User role in the platform' })
  @IsEnum(['client', 'freelancer'])
  role: 'client' | 'freelancer';

  @ApiProperty({ example: 'Experienced web developer with 5 years of experience', description: 'User bio (optional, recommended for freelancers)', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 50, description: 'Hourly rate in USD (optional, for freelancers)', required: false })
  @IsOptional()
  @IsNumber()
  hourly_rate?: number;

  @ApiProperty({ example: 'New York, USA', description: 'User location (optional)', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}
