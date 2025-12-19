import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 1, description: 'Gig ID for gig-based orders' })
  @IsOptional()
  @IsNumber()
  gig_id?: number;

  @ApiPropertyOptional({ example: 2, description: 'Project ID for project-based orders' })
  @IsOptional()
  @IsNumber()
  project_id?: number;

  @ApiProperty({ example: 3, description: 'Seller/freelancer user ID' })
  @IsNumber()
  seller_id: number;

  @ApiProperty({ example: 500, description: 'Order amount in USD' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 'Please include source code and documentation', description: 'Special requirements for the order' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ example: '2024-02-15T10:00:00Z', description: 'Expected delivery date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  delivery_date?: string;
}
