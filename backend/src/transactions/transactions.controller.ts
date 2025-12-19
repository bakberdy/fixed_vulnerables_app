import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/decorators/role.decorator';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './models/create-transaction.dto';
import type { User } from '../auth/models/user.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  @Get('my-transactions')
  @UseGuards(AuthGuard)
  async getMyTransactions(@CurrentUser() user: User) {
    return this.transactionsService.getUserTransactions(user.id);
  }

  @Get('balance')
  @UseGuards(AuthGuard)
  async getMyBalance(@CurrentUser() user: User) {
    return this.transactionsService.getUserBalance(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.getTransactionById(id);
  }
}
