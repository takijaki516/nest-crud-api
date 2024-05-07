import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@GetCurrentUser('id') userId: string) {
    const order = await this.ordersService.createOrder(userId);

    // TODO: 에러 타입 정의
    if (order.status !== 'success') {
      throw new Error(order.message);
    }

    return { message: 'created order successfully', data: order };
  }

  // TODO: add query pagination
  @Get()
  async getMyOrders(@GetCurrentUser('id') userId: string) {
    const orders = await this.ordersService.getOrders(userId);

    return { message: 'got all orders successfully', data: orders };
  }

  @Get(':orderId')
  async getMyOrderById(
    @GetCurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    const order = await this.ordersService.getOrderById(userId, orderId);

    return { message: 'got order successfully', data: order };
  }

  @Patch(':orderId/status')
  async changeOrderStatus(
    @GetCurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    const changedOrder = await this.ordersService.changeOrderStatus(
      userId,
      orderId,
      changeOrderStatusDto,
    );

    return { message: 'changed order status successfully', data: changedOrder };
  }

  @Patch('orderId')
  async cancelOrder(
    @GetCurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    const cancelledOrder = await this.ordersService.cancelOrder(
      userId,
      orderId,
    );

    return { message: 'cancelled order successfully', data: cancelledOrder };
  }
}
