import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '../token-payload';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/types/req-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  // REVIEW:
  // req.user에 담김
  async validate(payload: TokenPayload): Promise<UserInfo> {
    const { userId } = payload;
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    return { email: user.email, id: user.id, role: user.role };
  }
}
