import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './models/create-message.dto';
import type { User } from '../auth/models/user.entity';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @CurrentUser() user: User,
    @Body() dto: CreateMessageDto
  ) {
    return this.messagesService.sendMessage(user.id, dto);
  }

  @Get('inbox')
  async getInbox(@CurrentUser() user: User) {
    return this.messagesService.getInbox(user.id);
  }

  @Get('sent')
  async getSent(@CurrentUser() user: User) {
    return this.messagesService.getSent(user.id);
  }

  @Get(':id')
  async getMessage(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.getMessageById(id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.messagesService.markAsRead(id, user.id);
    return { message: 'Message marked as read' };
  }

  @Delete(':id')
  async deleteMessage(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.messagesService.deleteMessage(id, user.id);
    return { message: 'Message deleted successfully' };
  }
}
