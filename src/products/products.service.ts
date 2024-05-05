import { promises as fs } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException, Post } from '@nestjs/common';
import {randomUUID} from 'node:crypto'

import { PrismaService } from 'src/prisma/prisma.service';
import { PRODUCT_IMAGES } from './product-image';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}


  async createProduct(userId: string, data: CreateProductDto, fileName:string) {




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

  async getProduct(productId: string) {
    try {
      const product = await this.prismaService.product.
    } catch (error) {
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }
  }

  async updateProduct(productId:string)

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
