import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

import { PRODUCT_IMAGES } from './product-image';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: PRODUCT_IMAGES,
        filename: (req, file, callback) => {
          callback(null, `${randomUUID()}.${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProduct(
    @GetCurrentUser('id') userId: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const product = await this.productsService.createProduct(
      userId,
      createProductDto,
      file.filename,
    );

    return { message: 'created product successfully', data: product };
  }

  // TODO: add query
  @Get()
  async getProducts(
    @Query('size') size: string = '10',
    @Query('page') page: string = '1',
  ) {
    const products = await this.productsService.getProducts(+size, +page);

    return { message: 'got all products successfully', data: products };
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    const product = await this.productsService.getProduct(productId);

    return { message: 'got product by id successfully', data: product };
  }

  // TODO: add image
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

  // TODO: add search product
}
