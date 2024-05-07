import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async createProduct(userId: string, data: CreateProductDto) {
    // TODO: transaction
    const product = await this.prismaService.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    const image = await this.prismaService.productImage.create({
      data: {
        imageUrl: data.imageUrl,
        product: {
          connect: {
            id: product.id,
          },
        },
      },
    });

    return { product, image };
  }

  // NOTE: 첫번째 page는 1부터 시작
  async getProducts(size: number, page: number) {
    const products = await this.prismaService.product.findMany({
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    // flat image object
    return products.map((product) => {
      return {
        ...product,
        images: product.images.map((image) => image.imageUrl),
      };
    });
  }

  async getProduct(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // flat image object
    return {
      ...product,
      images: product.images.map((image) => image.imageUrl),
    };
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

  async deleteProduct(userId: string, productId: string) {
    const deletedProduct = await this.prismaService.product.delete({
      where: {
        userId: userId,
        id: productId,
      },
      select: {
        images: true, // image table은 onDelete:Cascade로 설정되어 있음
      },
    });

    // TODO: error handling
    await Promise.all(
      deletedProduct.images.map((image) => {
        return this.s3Service.deleteObject(image.imageUrl);
      }),
    );
  }
}
