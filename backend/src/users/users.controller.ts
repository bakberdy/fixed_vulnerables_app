import { Controller, Get, Put, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity, UserProfile, UserStats } from '../auth/models/user.entity';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';

interface CurrentUserData {
  id: number;
  email: string;
  role: string;
}

interface UpdateProfileDto {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  hourly_rate?: number;
  location?: string;
}

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserData): Promise<UserEntity> {
    return this.usersService.getUserById(user.id);
  }

  @Get(':id/profile')
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProfile> {
    return this.usersService.getUserProfile(id);
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.usersService.updateProfile(id, data);
  }

  @Get(':id/stats')
  async getUserStats(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserStats> {
    return this.usersService.getUserStats(id);
  }
}
