import { IsString, IsNumber, IsEnum, Min, IsOptional } from 'class-validator';

export class UpdateProposalDto {
  @IsOptional()
  @IsString()
  cover_letter?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  proposed_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  delivery_days?: number;

  @IsOptional()
  @IsEnum(['pending', 'accepted', 'rejected'])
  status?: 'pending' | 'accepted' | 'rejected';
}
