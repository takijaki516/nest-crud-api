import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
// import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
