import { IsString, IsNumber, IsEnum, IsArray, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGigDto {
  @ApiProperty({ example: 'I will create a professional website', description: 'Gig title', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'I will design and develop a responsive website using React and Node.js', description: 'Detailed gig description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Web Development', description: 'Gig category', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiProperty({ example: 500, description: 'Gig price in USD', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 7, description: 'Delivery time in days', minimum: 1 })
  @IsNumber()
  @Min(1)
  delivery_days: number;

  @ApiProperty({ example: ['React', 'Node.js', 'TypeScript'], description: 'Required skills', type: [String], required: false })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ example: 1, description: 'Whether gig is active (1) or inactive (0)', required: false })
  @IsOptional()
  is_active?: number;
}
