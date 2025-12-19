import { IsString, IsNumber, IsEnum, IsArray, Min, MaxLength, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget_min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget_max?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration_days?: number;

  @IsOptional()
  @IsEnum(['open', 'in_progress', 'completed', 'cancelled'])
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
