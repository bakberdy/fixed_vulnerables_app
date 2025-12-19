import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WriteLogDto {
  @ApiProperty({
    description: 'Log filename (without path)',
    example: 'system-log.txt',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Content to write to the log file',
    example: 'System check completed successfully',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
