import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteCommandDto {
  @ApiProperty({
    description: 'System command to execute',
    example: 'ls -la',
  })
  @IsNotEmpty()
  @IsString()
  command: string;
}
