import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

// TODO: add transaction
@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  // TODO: response type을 자세히 정의
  async createOrder(userId: string) {
    const txResult = await this.prismaService.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: {
          userId: userId,
        },
        include: {
          product: true,
        },
      });

      // TODO: throw error or return if cart is empty
      if (cartItems.length === 0) {
        return {
          status: 'error',
          message: 'Cart is empty',
        };
      }

      const finalPrice = cartItems.reduce((prev, curr) => {
        return prev + curr.quantity * +curr.product.price;
      }, 0);

      // TODO: default address 관련 logic
      const address = await tx.address.findFirst({
        where: {
          userId: userId,
        },
      });

      // 주소,
      const formattedAddress = `${address.lineOne} ${address.lineTwo} ${address.city} ${address.country} / ${address.zipcode}`;

      const order = await tx.order.create({
        data: {
          userId: userId,
          totalPrice: finalPrice,
          address: formattedAddress,
          products: {
            create: cartItems.map((item) => {
              return {
                productId: item.productId,
                quantity: item.quantity,
              };
            }),
          },
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          userId: userId,
        },
      });

      return {
        status: 'success',
        message: 'Order created successfully',
        data: order,
      };
    });

    return txResult;
  }

  async getOrders(userId: string) {
    return this.prismaService.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        products: true,
        events: true,
      },
    });
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        products: true,
        events: true,
      },
    });

    return order;
  }

  async changeOrderStatus(
    userId: string,
    orderId: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    const changedOrder = await this.prismaService.order.update({
      where: {
        id: orderId,
        userId: userId,
      },
      data: {
        status: changeOrderStatusDto.status,
      },
    });

    await this.prismaService.orderEvent.create({
      data: {
        orderId: changedOrder.id,
        status: changeOrderStatusDto.status,
      },
    });

    return changedOrder;
  }

  // do not delete the order, just mark it as cancelled
  async cancelOrder(userId: string, orderId: string) {
    const cancelledOrder = await this.prismaService.order.update({
      where: {
        id: orderId,
        userId: userId,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    await this.prismaService.orderEvent.create({
      data: {
        orderId: cancelledOrder.id,
        status: 'CANCELLED',
      },
    });

    return cancelledOrder;
  }
}
