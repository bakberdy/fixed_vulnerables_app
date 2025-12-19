import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FilesService } from './files.service';
import { FileEntity } from './models/file.entity';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';

interface CurrentUserData {
  id: number;
  email: string;
  role: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx'
];

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const uniqueName = `${Date.now()}-${sanitizedName}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return callback(new BadRequestException(`File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
        }

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return callback(new BadRequestException(`MIME type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`), false);
        }

        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body('entity_type') entityType: FileEntity['entity_type'],
    @Body('entity_id') entityId: string,
  ): Promise<FileEntity> {
    return this.filesService.saveFileRecord(
      user.id,
      file,
      entityType,
      parseInt(entityId, 10),
    );
  }

  @Get(':id')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData
  ): Promise<FileEntity> {
    return this.filesService.getFileByIdWithAccess(id, user.id, user.role);
  }

  @Get('entity/:type/:id')
  async getFilesByEntity(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FileEntity[]> {
    return this.filesService.getFilesByEntity(type, id);
  }

  @Delete(':id')
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData
  ): Promise<void> {
    return this.filesService.deleteFileWithAccess(id, user.id, user.role);
  }
}
