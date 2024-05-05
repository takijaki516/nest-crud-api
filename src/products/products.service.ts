import { promises as fs } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PRODUCT_IMAGES } from './product-image';
import { CreateProductDto } from './dto/create-product.request';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductDto, userId: number) {
    return this.prismaService.product.create({
      data: {
        ...data,
        userId,f
      },
    });
  }

  async getProducts() {
    const products = await this.prismaService.product.findMany();

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  async getProduct(productId: number) {
    try {
    } catch (error) {
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }
  }

  private async imageExists(productId: number) {
    try {
      await fs.access(
        join(`${PRODUCT_IMAGES}/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}