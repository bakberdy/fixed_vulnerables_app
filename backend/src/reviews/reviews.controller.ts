import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './models/create-review.dto';
import type { User } from '../auth/models/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReview(
    @CurrentUser() user: User,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.createReview(user.id, dto);
  }

  @Get('user/:userId')
  async getUserReviews(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewsService.getUserReviews(userId);
  }

  @Get(':id')
  async getReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getReviewById(id);
  }
}
