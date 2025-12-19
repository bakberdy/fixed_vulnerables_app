import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReadLogDto {
  @ApiProperty({
    description: 'Log filename to read',
    example: 'system-log.txt',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;
}
