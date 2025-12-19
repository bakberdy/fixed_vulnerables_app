import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/decorators/role.decorator';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './models/create-proposal.dto';
import { UpdateProposalDto } from './models/update-proposal.dto';
import type { User } from '../auth/models/user.entity';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  async createProposal(
    @CurrentUser() user: User,
    @Body() dto: CreateProposalDto
  ) {
    return this.proposalsService.createProposal(user.id, dto);
  }

  @Get('my-proposals')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  async getMyProposals(@CurrentUser() user: User) {
    return this.proposalsService.getFreelancerProposals(user.id);
  }

  @Get('project/:projectId')
  @UseGuards(AuthGuard)
  async getProjectProposals(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.proposalsService.getProposalsByProject(projectId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getProposal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.proposalsService.getProposalByIdWithAccess(id, user.id, user.role);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateProposal(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProposalDto,
    @CurrentUser() user: User
  ) {
    return this.proposalsService.updateProposalWithAccess(id, user.id, user.role, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('freelancer')
  async deleteProposal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.proposalsService.deleteProposal(id, user.id);
    return { message: 'Proposal deleted successfully' };
  }
}
