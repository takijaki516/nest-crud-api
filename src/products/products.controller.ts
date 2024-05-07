import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Post()
  async createProduct(
    @GetCurrentUser('id') userId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    console.log(
      '🚀 ~ file: products.controller.ts:31 ~ ProductsController ~ createProductDto:',
      createProductDto,
    );
    const { image, product } = await this.productsService.createProduct(
      userId,
      createProductDto,
    );

    return {
      message: 'created product successfully',
      data: {
        imageUrl: image.imageUrl,
        product,
      },
    };
  }

  // TODO: add swagger response schema
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get()
  async getProducts(
    @Query('size') size: string = '10',
    @Query('page') page: string = '1',
  ) {
    const products = await this.productsService.getProducts(+size, +page);

    return { message: 'got all products successfully', data: products };
  }

  @ApiParam({ name: 'productId', required: true })
  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    const product = await this.productsService.getProduct(productId);

    return { message: 'got product by id successfully', data: product };
  }

  // TODO:
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Patch(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.updateProduct(
      productId,
      updateProductDto,
    );

    return { message: 'updated product by id successfully', data: product };
  }

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Delete(':productId')
  async deleteProduct(
    @GetCurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    await this.productsService.deleteProduct(userId, productId);
    return { message: 'deleted product successfully' };
  }

  // TODO: add search product
}
