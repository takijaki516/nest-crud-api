import { Module } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [PrismaModule, S3Module],
})
export class ProductsModule {}
