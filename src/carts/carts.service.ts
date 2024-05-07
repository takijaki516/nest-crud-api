import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemRequestDto } from './dto/add-item-request.dto';
import { ChangeQuantityRequestDto } from './dto/change-quantity-request.dto';

@Injectable()
export class CartsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCarts(userId: string) {
    const cartsWithProducts = await this.prismaService.cartItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true,
      },
    });

    const parsedCartsWithProducts = cartsWithProducts.map((item) => {
      return {
        product: item.product,
        quantity: item.quantity,
        cartId: item.id,
      };
    });

    return parsedCartsWithProducts;
  }

  async addItemToCart(userId: string, addItemRequestDto: AddItemRequestDto) {
    const product = await this.prismaService.product.findUnique({
      where: { id: addItemRequestDto.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const cartItem = await this.prismaService.cartItem.create({
      data: {
        quantity: addItemRequestDto.quantity,
        productId: product.id,
        userId: userId,
      },
    });

    return cartItem;
  }

  async changeQuantity(
    userId: string,
    cartId: string,
    changeQuantityRequestDto: ChangeQuantityRequestDto,
  ) {
    const cartItem = await this.prismaService.cartItem.update({
      where: {
        id: cartId,
        userId: userId,
      },
      data: {
        quantity: changeQuantityRequestDto.quantity,
      },
    });

    return cartItem;
  }

  async deleteCart(userId: string, cartId: string) {
    await this.prismaService.cartItem.delete({
      where: { id: cartId, userId: userId },
    });
  }
}
