import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @GetCurrentUser('id') userId: string,
    createOrderDto: CreateUserDto,
  ) {
    const order = await this.ordersService.createOrder(userId, createOrderDto);

    return { message: 'created order successfully', data: order };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@GetCurrentUser('id') userId: string) {
    const orders = await this.ordersService.getOrders(userId);

    return { message: 'got all orders successfully', data: orders };
  }

  @Delete('id')
  async deleteOrder(@Param('id') id: string) {
    await this.ordersService.deleteOrder(id);

    return { message: 'deleted order successfully' };
  }
}
