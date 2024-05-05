import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import ms from 'ms';

import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.getUser(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const expires = new Date();
        expires.setMilliseconds(
          expires.getMilliseconds() +
            ms(this.configService.getOrThrow<string>('JWT_EXPIRATION')),
        );

        const payload = { email, username: user.username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
      }
      throw new UnauthorizedException('login failed');
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;

    const user = await this.usersService.getUser(email);
    if (user) {
      throw new ForbiddenException('user already exists');
    }

    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRATION')),
    );

    const payload = { email, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    await this.usersService.createUser({ email, username, password });

    return { accessToken };
  }
}
