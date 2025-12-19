import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/decorators/role.decorator';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './models/create-project.dto';
import { UpdateProjectDto } from './models/update-project.dto';
import { SearchProjectDto } from './models/search-project.dto';
import type { User } from '../auth/models/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('client')
  async createProject(
    @CurrentUser() user: User,
    @Body() dto: CreateProjectDto
  ) {
    return this.projectsService.createProject(user.id, dto);
  }

  @Get('search')
  async searchProjects(@Query() dto: SearchProjectDto) {
    return this.projectsService.searchProjects(dto);
  }

  @Get('my-projects')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('client')
  async getMyProjects(@CurrentUser() user: User) {
    return this.projectsService.getClientProjects(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.projectsService.getProjectByIdWithAccess(id, user.id, user.role);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('client')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateProjectDto
  ) {
    return this.projectsService.updateProject(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('client')
  async deleteProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.projectsService.deleteProject(id, user.id);
    return { message: 'Project cancelled successfully' };
  }
}
