import { IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'Order ID for which the review is given' })
  @IsNumber()
  order_id: number;

  @ApiProperty({ example: 3, description: 'User ID of the person being reviewed' })
  @IsNumber()
  reviewee_id: number;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5 stars', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Excellent work! Delivered on time and exceeded expectations.', description: 'Review comment' })
  @IsString()
  comment: string;
}
