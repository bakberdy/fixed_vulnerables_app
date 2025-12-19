import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './models/create-order.dto';
import { UpdateOrderDto } from './models/update-order.dto';
import type { User } from '../auth/models/user.entity';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser() user: User,
    @Body() dto: CreateOrderDto
  ) {
    return this.ordersService.createOrder(user.id, dto);
  }

  @Get('purchases')
  async getPurchases(@CurrentUser() user: User) {
    return this.ordersService.getBuyerOrders(user.id);
  }

  @Get('sales')
  async getSales(@CurrentUser() user: User) {
    return this.ordersService.getSellerOrders(user.id);
  }

  @Get(':id')
  async getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Put(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateOrderDto
  ) {
    return this.ordersService.updateOrder(id, user.id, dto);
  }

  @Delete(':id')
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.ordersService.cancelOrder(id, user.id);
    return { message: 'Order cancelled successfully' };
  }
}
