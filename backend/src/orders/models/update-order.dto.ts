import { IsEnum, IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled', 'disputed'])
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsDateString()
  delivery_date?: string;
}
