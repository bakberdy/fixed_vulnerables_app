import { IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDto {
  @ApiProperty({ example: 1, description: 'Project ID to submit proposal for' })
  @Type(() => Number)
  @IsNumber()
  project_id: number;

  @ApiProperty({ example: 'I have 5 years of experience building e-commerce platforms and can deliver this project within the timeline.', description: 'Cover letter explaining why you are a good fit' })
  @IsString()
  cover_letter: string;

  @ApiProperty({ example: 3000, description: 'Proposed amount in USD', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  proposed_amount: number;

  @ApiProperty({ example: 25, description: 'Delivery time in days', minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  delivery_days: number;
}
