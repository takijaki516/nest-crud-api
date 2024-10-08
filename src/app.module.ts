import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    // REVIEW:
    // LoggerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => {
    //     const isProduction = configService.get('NODE_ENV') === 'production';
    //     return {
    //       pinoHttp: {
    //         transport: isProduction
    //           ? undefined
    //           : {
    //               target: 'pino-pretty',
    //               options: {
    //                 singleLine: true,
    //               },
    //             },
    //         level: isProduction ? 'info' : 'debug',
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    //
    // REVIEW:
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      // set cache to true in production
      cache: false,
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    ProductsModule,
    CartsModule,
    OrdersModule,
    S3Module,
  ],
})
export class AppModule {}
