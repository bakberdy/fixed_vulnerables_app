import { IsString, IsNumber, IsEnum, IsArray, Min, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGigDto {
  @ApiPropertyOptional({ example: 'Updated Title', description: 'Gig title', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description with new details', description: 'Gig description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Web Development', description: 'Gig category', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 299, description: 'Gig price in USD', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 5, description: 'Delivery time in days', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  delivery_days?: number;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'paused', 'deleted'], description: 'Gig status' })
  @IsOptional()
  @IsEnum(['active', 'paused', 'deleted'])
  status?: 'active' | 'paused' | 'deleted';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ example: 1, description: 'Whether gig is active (1) or inactive (0)' })
  @IsOptional()
  is_active?: number;
}
