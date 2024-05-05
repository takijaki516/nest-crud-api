import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.refresh_token,
      ]),
      ignoreExpiration: true, // REVIEW:
      secretOrKey: configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
    });
  }

  async validate(payload: { userId: string; userEmail: string }) {
    const { userEmail } = payload;

    const user = await this.usersService.getUser(userEmail);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
