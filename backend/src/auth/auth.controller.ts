import { Controller, Post, Body, Session, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import { RateLimitGuard } from '../core/guards/rate-limit.guard';
import type { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Create a new user account with role (client or freelancer)' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or user already exists' })
  async register(@Body() registerDto: RegisterDto, @Req() request: Request): Promise<UserEntity> {
    const user = await this.authService.register(registerDto);

    if (request.session) {
      request.session.userId = user.id;
      request.session.userEmail = user.email;
      request.session.userRole = user.role;
    }

    return user;
  }

  @Post('login')
  @UseGuards(RateLimitGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user and create session' })
  @ApiResponse({ status: 200, description: 'Login successful, session created' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
  ): Promise<UserEntity> {
    const user = await this.authService.login(loginDto);
    
    if (request.session) {
      request.session.userId = user.id;
      request.session.userEmail = user.email;
      request.session.userRole = user.role;
    }

    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request: Request): { message: string } {
    if (request.session) {
      request.session.destroy(() => {});
    }
    return { message: 'Logged out successfully' };
  }
}
