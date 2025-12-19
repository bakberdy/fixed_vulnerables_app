import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 5, description: 'Receiver user ID' })
  @IsNumber()
  receiver_id: number;

  @ApiProperty({ example: 'Project proposal discussion', description: 'Message subject', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ example: 'Hi, I would like to discuss your project requirements in more detail.', description: 'Message body' })
  @IsString()
  body: string;
}
