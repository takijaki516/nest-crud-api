import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  // TODO:
  // 1. to create a transaction
  // 2. to list all the cart items and proceed if cart is not empty
  // 3. calculate the total amount
  // 4. fetch address of user
  // 5. to define computed field for formatted address on address module
  // 6. we will create a order and order productsorder products
  // 7. create order event
  // 8. to empty the cart
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {}

  async getOrders(userId: string) {
    return this.prismaService.order.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async deleteOrder(id: string) {
    return this.prismaService.order.delete({
      where: {
        id,
      },
    });
  }
}
