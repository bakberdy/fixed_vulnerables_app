import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { FileEntity } from './models/file.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadDir = './public/uploads';

  constructor(private readonly db: DatabaseService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFileRecord(
    uploaderId: number,
    file: Express.Multer.File,
    entityType: FileEntity['entity_type'],
    entityId: number,
  ): Promise<FileEntity> {
    const result = this.db.execute(
      `INSERT INTO files (uploader_id, filename, original_name, file_path, file_size, mime_type, entity_type, entity_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uploaderId,
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        entityType,
        entityId,
      ],
    );

    const fileRecord = this.db.queryOne<FileEntity>(
      'SELECT * FROM files WHERE id = ?',
      [result.lastInsertRowid],
    );

    if (!fileRecord) {
      throw new Error('Failed to save file record');
    }

    return fileRecord;
  }

  async getFileById(id: number): Promise<FileEntity> {
    const file = this.db.queryOne<FileEntity>(
      'SELECT * FROM files WHERE id = ?',
      [id],
    );

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async getFileByIdWithAccess(id: number, userId: number, userRole: string): Promise<FileEntity> {
    const file = await this.getFileById(id);

    const isOwner = file.uploader_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      const entityAccess = await this.checkEntityAccess(file, userId);
      if (!entityAccess) {
        throw new NotFoundException('File not found or access denied');
      }
    }

    return file;
  }

  private async checkEntityAccess(file: FileEntity, userId: number): Promise<boolean> {
    switch (file.entity_type) {
      case 'project': {
        const project = this.db.queryOne<{ client_id: number }>(
          'SELECT client_id FROM projects WHERE id = ?',
          [file.entity_id]
        );
        if (project && project.client_id === userId) return true;

        const proposal = this.db.query(
          'SELECT id FROM proposals WHERE project_id = ? AND freelancer_id = ?',
          [file.entity_id, userId]
        );
        return proposal.length > 0;
      }
      case 'proposal': {
        const proposal = this.db.queryOne<{ freelancer_id: number; project_id: number }>(
          'SELECT freelancer_id, project_id FROM proposals WHERE id = ?',
          [file.entity_id]
        );
        if (proposal && proposal.freelancer_id === userId) return true;

        const project = this.db.queryOne<{ client_id: number }>(
          'SELECT client_id FROM projects WHERE id = ?',
          [proposal?.project_id]
        );
        return project?.client_id === userId;
      }
      case 'gig': {
        const gig = this.db.queryOne<{ freelancer_id: number }>(
          'SELECT freelancer_id FROM gigs WHERE id = ?',
          [file.entity_id]
        );
        return gig?.freelancer_id === userId;
      }
      case 'order': {
        const order = this.db.queryOne<{ client_id: number; freelancer_id: number }>(
          'SELECT client_id, freelancer_id FROM orders WHERE id = ?',
          [file.entity_id]
        );
        return order?.client_id === userId || order?.freelancer_id === userId;
      }
      default:
        return false;
    }
  }

  async getFilesByEntity(entityType: string, entityId: number): Promise<FileEntity[]> {
    return this.db.query<FileEntity>(
      'SELECT * FROM files WHERE entity_type = ? AND entity_id = ?',
      [entityType, entityId],
    );
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.getFileById(id);

    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    this.db.execute('DELETE FROM files WHERE id = ?', [id]);
  }

  async deleteFileWithAccess(id: number, userId: number, userRole: string): Promise<void> {
    const file = await this.getFileById(id);

    const isOwner = file.uploader_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new NotFoundException('File not found or access denied');
    }

    await this.deleteFile(id);
  }
}
