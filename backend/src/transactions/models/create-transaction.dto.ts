import { IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsNumber()
  order_id?: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(['payment', 'refund', 'withdrawal', 'deposit'])
  type: 'payment' | 'refund' | 'withdrawal' | 'deposit';

  @IsOptional()
  @IsString()
  description?: string;
}
