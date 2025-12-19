import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchGigDto {
  @ApiProperty({ example: 'website', description: 'Search query for gig title/description', required: false })
  @IsOptional()
  query?: string;

  @ApiProperty({ example: 'Web Development', description: 'Filter by category', required: false })
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 100, description: 'Minimum price filter', minimum: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiProperty({ example: 1000, description: 'Maximum price filter', minimum: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiProperty({ example: 'recent', enum: ['price', 'rating', 'recent'], description: 'Sort order', required: false })
  @IsOptional()
  @IsString()
  sort_by?: 'price' | 'rating' | 'recent';
}
