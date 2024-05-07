import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { TokenPayload } from '../token-payload';

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
        (req: Request) => {
          return req.cookies.refresh_token;
        },
      ]),
      ignoreExpiration: true, // REVIEW:
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const { userId } = payload;

    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
