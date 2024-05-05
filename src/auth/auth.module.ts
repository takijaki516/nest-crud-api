import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.getOrThrow('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: configService.getOrThrow('JWT_EXPIRATION'),
    //     },
    //   }),
    //   inject: [ConfigModule],
    // }),
    ConfigModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  // REVIEW: 왜 strategy를 providers에 추가하지 않는가?
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
