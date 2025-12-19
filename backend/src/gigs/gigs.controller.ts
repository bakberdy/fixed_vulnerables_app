import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/decorators/role.decorator';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { GigsService } from './gigs.service';
import { CreateGigDto } from './models/create-gig.dto';
import { UpdateGigDto } from './models/update-gig.dto';
import { SearchGigDto } from './models/search-gig.dto';
import type { User } from '../auth/models/user.entity';

@ApiTags('Gigs')
@Controller('gigs')
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  @ApiOperation({ summary: 'Create a new gig', description: 'Freelancers can create service offerings (requires authentication)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Gig created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - only freelancers can create gigs' })
  async createGig(
    @CurrentUser() user: User,
    @Body() dto: CreateGigDto
  ) {
    return this.gigsService.createGig(user.id, dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search gigs', description: 'Search and filter gigs' })
  @ApiResponse({ status: 200, description: 'List of matching gigs' })
  async searchGigs(@Query() dto: SearchGigDto) {
    return this.gigsService.searchGigs(dto);
  }

  @Get('my-gigs')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  async getMyGigs(@CurrentUser() user: User) {
    return this.gigsService.getFreelancerGigs(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getGig(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.gigsService.getGigByIdWithAccess(id, user.id, user.role);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  async updateGig(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateGigDto
  ) {
    return this.gigsService.updateGig(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  async deleteGig(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.gigsService.deleteGig(id, user.id);
    return { message: 'Gig deleted successfully' };
  }
}
