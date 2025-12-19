import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Proposal } from './models/proposal.entity';
import { CreateProposalDto } from './models/create-proposal.dto';
import { UpdateProposalDto } from './models/update-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly db: DatabaseService) {}

  async createProposal(freelancerId: number, dto: CreateProposalDto): Promise<Proposal> {
    const projects = this.db.query<{ status: string }>(
      'SELECT status FROM projects WHERE id = ?',
      [dto.project_id]
    );

    if (projects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    if (projects[0].status !== 'open') {
      throw new BadRequestException('Project is not accepting proposals');
    }

    const existing = this.db.query(
      'SELECT id FROM proposals WHERE project_id = ? AND freelancer_id = ?',
      [dto.project_id, freelancerId]
    );

    if (existing.length > 0) {
      throw new BadRequestException('You already submitted a proposal for this project');
    }

    const result = this.db.execute(
      `INSERT INTO proposals (project_id, freelancer_id, cover_letter, bid_amount, delivery_days, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [dto.project_id, freelancerId, dto.cover_letter, dto.proposed_amount, dto.delivery_days]
    );

    return this.getProposalById(result.lastInsertRowid as number);
  }

  async getProposalById(id: number): Promise<Proposal> {
    const proposals = this.db.query<Proposal>(
      `SELECT p.*, p.bid_amount as proposed_amount,
              u.full_name as freelancer_name, 
              u.avatar_url as freelancer_avatar, 
              u.rating as freelancer_rating,
              pr.title as project_title
       FROM proposals p
       JOIN users u ON p.freelancer_id = u.id
       JOIN projects pr ON p.project_id = pr.id
       WHERE p.id = ?`,
      [id]
    );

    if (proposals.length === 0) {
      throw new NotFoundException('Proposal not found');
    }

    return proposals[0];
  }

  async getProposalsByProject(projectId: number): Promise<Proposal[]> {
    return this.db.query<Proposal>(
      `SELECT p.*, 
              u.full_name as freelancer_name, 
              u.avatar_url as freelancer_avatar, 
              u.rating as freelancer_rating
       FROM proposals p
       JOIN users u ON p.freelancer_id = u.id
       WHERE p.project_id = ?
       ORDER BY p.created_at DESC`,
      [projectId]
    );
  }

  async getFreelancerProposals(freelancerId: number): Promise<Proposal[]> {
    return this.db.query<Proposal>(
      `SELECT p.*, p.bid_amount as proposed_amount, pr.title as project_title
       FROM proposals p
       JOIN projects pr ON p.project_id = pr.id
       WHERE p.freelancer_id = ?
       ORDER BY p.submitted_at DESC`,
      [freelancerId]
    );
  }

  async updateProposal(id: number, dto: UpdateProposalDto): Promise<Proposal> {
    const proposals = this.db.query<Proposal>('SELECT * FROM proposals WHERE id = ?', [id]);
    
    if (proposals.length === 0) {
      throw new NotFoundException('Proposal not found');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.cover_letter !== undefined) {
      updates.push('cover_letter = ?');
      values.push(dto.cover_letter);
    }
    if (dto.proposed_amount !== undefined) {
      updates.push('proposed_amount = ?');
      values.push(dto.proposed_amount);
    }
    if (dto.delivery_days !== undefined) {
      updates.push('delivery_days = ?');
      values.push(dto.delivery_days);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      this.db.execute(
        `UPDATE proposals SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.getProposalById(id);
  }

  async getProposalByIdWithAccess(id: number, userId: number, userRole: string): Promise<Proposal> {
    const proposal = await this.getProposalById(id);
    
    const project = this.db.queryOne<{ client_id: number }>(
      'SELECT client_id FROM projects WHERE id = ?',
      [proposal.project_id]
    );

    if (!project) {
      throw new NotFoundException('Associated project not found');
    }

    const isFreelancer = proposal.freelancer_id === userId;
    const isClient = project.client_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isFreelancer && !isClient && !isAdmin) {
      throw new BadRequestException('You do not have permission to view this proposal');
    }

    return proposal;
  }

  async updateProposalWithAccess(id: number, userId: number, userRole: string, dto: UpdateProposalDto): Promise<Proposal> {
    const proposals = this.db.query<Proposal>('SELECT * FROM proposals WHERE id = ?', [id]);
    
    if (proposals.length === 0) {
      throw new NotFoundException('Proposal not found');
    }

    const proposal = proposals[0];

    const project = this.db.queryOne<{ client_id: number }>(
      'SELECT client_id FROM projects WHERE id = ?',
      [proposal.project_id]
    );

    if (!project) {
      throw new NotFoundException('Associated project not found');
    }

    const isFreelancer = proposal.freelancer_id === userId;
    const isClient = project.client_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isFreelancer && !isClient && !isAdmin) {
      throw new BadRequestException('You do not have permission to update this proposal');
    }

    if (dto.status && !isClient && !isAdmin) {
      throw new BadRequestException('Only the project owner can change proposal status');
    }

    if ((dto.cover_letter || dto.proposed_amount || dto.delivery_days) && !isFreelancer && !isAdmin) {
      throw new BadRequestException('Only the proposal owner can edit proposal details');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.cover_letter !== undefined) {
      updates.push('cover_letter = ?');
      values.push(dto.cover_letter);
    }
    if (dto.proposed_amount !== undefined) {
      updates.push('proposed_amount = ?');
      values.push(dto.proposed_amount);
    }
    if (dto.delivery_days !== undefined) {
      updates.push('delivery_days = ?');
      values.push(dto.delivery_days);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      this.db.execute(
        `UPDATE proposals SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.getProposalById(id);
  }

  async deleteProposal(id: number, freelancerId: number): Promise<void> {
    const proposals = this.db.query<Proposal>('SELECT * FROM proposals WHERE id = ?', [id]);
    
    if (proposals.length === 0) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposals[0].freelancer_id !== freelancerId) {
      throw new BadRequestException('You can only delete your own proposals');
    }

    if (proposals[0].status !== 'pending') {
      throw new BadRequestException('Cannot delete a proposal that has been reviewed');
    }

    this.db.execute('DELETE FROM proposals WHERE id = ?', [id]);
  }
}
