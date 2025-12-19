import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UtilsService } from './utils.service';
import { WriteLogDto } from './models/write-log.dto';
import { ReadLogDto } from './models/read-log.dto';
import { ExecuteCommandDto } from './models/execute-command.dto';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/decorators/role.decorator';

@ApiTags('utils')
@ApiBearerAuth()
@Controller('api/utils')
@UseGuards(AuthGuard, RoleGuard)
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Post('logs/write')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Write system log (Admin only)', 
    description: 'Write content to a log file using system commands (WARNING: Contains command injection vulnerability for educational purposes)' 
  })
  @ApiResponse({ status: 200, description: 'Log written successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async writeLog(@Body() writeLogDto: WriteLogDto) {
    return this.utilsService.writeLog(writeLogDto.filename, writeLogDto.content);
  }

  @Get('logs/read')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Read system log (Admin only)', 
    description: 'Read content from a log file (WARNING: Contains command injection vulnerability for educational purposes)' 
  })
  @ApiResponse({ status: 200, description: 'Log content retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async readLog(@Query() readLogDto: ReadLogDto) {
    return this.utilsService.readLog(readLogDto.filename);
  }

  @Get('logs/list')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'List all log files (Admin only)', 
    description: 'List all available log files' 
  })
  @ApiResponse({ status: 200, description: 'Log files listed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async listLogs() {
    return this.utilsService.listLogs();
  }

  @Get('execute')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Execute system command (Admin only)', 
    description: 'Execute arbitrary system commands for diagnostics (WARNING: CRITICAL command injection vulnerability - user input directly executed)' 
  })
  @ApiResponse({ status: 200, description: 'Command executed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async executeCommand(@Query() executeCommandDto: ExecuteCommandDto) {
    return this.utilsService.executeCommand(executeCommandDto.command);
  }
}
