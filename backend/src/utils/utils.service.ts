import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);

@Injectable()
export class UtilsService {
  private readonly logsDirectory = path.join(process.cwd(), 'public', 'logs');

  private sanitizeFilename(filename: string): string {
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!sanitized || sanitized.startsWith('.') || sanitized.includes('..')) {
      throw new BadRequestException('Invalid filename');
    }
    return sanitized;
  }

  async writeLog(filename: string, content: string): Promise<{ success: boolean; message: string }> {
    try {
      const sanitizedFilename = this.sanitizeFilename(filename);
      
      await mkdir(this.logsDirectory, { recursive: true });
      
      const filePath = path.join(this.logsDirectory, sanitizedFilename);
      
      if (!filePath.startsWith(this.logsDirectory)) {
        throw new BadRequestException('Invalid file path');
      }
      
      await writeFile(filePath, content, 'utf8');

      return {
        success: true,
        message: `Log written successfully to ${sanitizedFilename}`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async readLog(filename: string): Promise<{ success: boolean; content?: string; message?: string }> {
    try {
      const sanitizedFilename = this.sanitizeFilename(filename);
      const filePath = path.join(this.logsDirectory, sanitizedFilename);
      
      if (!filePath.startsWith(this.logsDirectory)) {
        throw new BadRequestException('Invalid file path');
      }
      
      const content = await readFile(filePath, 'utf8');

      return {
        success: true,
        content
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async listLogs(): Promise<{ success: boolean; files?: string[]; message?: string }> {
    try {
      await mkdir(this.logsDirectory, { recursive: true });
      
      const files = await readdir(this.logsDirectory);

      return {
        success: true,
        files: files.filter(f => !f.startsWith('.'))
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async executeCommand(command: string): Promise<{ success: boolean; output?: string; message?: string }> {
    return {
      success: false,
      message: 'Command execution has been disabled for security reasons'
    };
  }
}
