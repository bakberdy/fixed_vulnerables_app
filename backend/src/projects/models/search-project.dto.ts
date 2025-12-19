import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProjectDto {
  @ApiPropertyOptional({ example: 'e-commerce', description: 'Search term for project title/description' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ example: 500, description: 'Minimum budget filter', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_budget?: number;

  @ApiPropertyOptional({ example: 10000, description: 'Maximum budget filter', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_budget?: number;

  @ApiPropertyOptional({ example: 'open', enum: ['open', 'in_progress', 'completed', 'cancelled'], description: 'Project status filter' })
  @IsOptional()
  @IsString()
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ example: 'budget', enum: ['budget', 'recent'], description: 'Sort order' })
  @IsOptional()
  @IsString()
  sort_by?: 'budget' | 'recent';
}
