import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
// import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // REVIEW:
  // app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // REVIEW:
  // app.useGlobalInterceptors();

  app.use(cookieParser());

  // NOTE: swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .setTitle('E-commerce API')
    .setDescription('The E-commerce API using nestjs')
    .setVersion('0.1.0')
    .addTag('ecommerce')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
