import { IsString, IsNumber, IsArray, Min, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Build an E-commerce Website', description: 'Project title', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Need a full-stack developer to build a modern e-commerce platform with payment integration', description: 'Detailed project description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'web-development', description: 'Project category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 1000, description: 'Minimum budget in USD', minimum: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget_min?: number;

  @ApiProperty({ example: 5000, description: 'Maximum budget in USD', minimum: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget_max?: number;

  @ApiProperty({ example: 30, description: 'Project duration in days', minimum: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration_days?: number;

  @ApiProperty({ example: ['React', 'Node.js', 'MongoDB'], description: 'Required skills', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
