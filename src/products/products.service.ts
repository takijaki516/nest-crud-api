import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    userId: string,
    data: CreateProductDto,
    fileName: string,
  ) {
    const product = await this.prismaService.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
        imageId: fileName,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return product;
  }

  // NOTE: 첫번째 page는 0부터 시작
  async getProducts(size: number, page: number) {
    const products = await this.prismaService.product.findMany({
      take: size,
      skip: (page - 1) * size,
    });
    return products;
  }

  async getProduct(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateProductDto,
      },
    });

    return product;
  }
}
