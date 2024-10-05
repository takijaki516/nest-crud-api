import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenPayload } from './token-payload';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.getUserByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const accessToken = await this.createAccessToken({ userId: user.id });
        const refreshToken = await this.rotateRefreshToken({ userId: user.id });

        return { accessToken, refreshToken };
      }
      throw new UnauthorizedException('login failed');
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;

    const user = await this.usersService.getUserById(email);
    if (user) {
      throw new ForbiddenException('user already exists');
    }

    const newUser = await this.usersService.createUser({
      email,
      username,
      password,
    });

    const payload: TokenPayload = { userId: newUser.id };
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.rotateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async refresh(userId: string) {
    const accessToken = await this.createAccessToken({ userId });
    const refreshToken = await this.rotateRefreshToken({ userId });

    return { accessToken, refreshToken };
  }

  async removeRefreshToken(userId: string) {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async deleteUser(userId: string) {
    await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }

  private createAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRATION'),
    });
  }

  private createRefreshToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'REFRESH_TOKEN_EXPIRATION',
      ),
    });
  }

  private async saveRefreshToken(userId: string, hashedRt: string) {
    await this.prismaService.refreshToken.create({
      data: {
        token: hashedRt,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  private async rotateRefreshToken(rfPayload: TokenPayload) {
    const userId = rfPayload.userId;

    // NOTE: deleteMany. why not delete the specific token?
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    const newRefreshToken = await this.createRefreshToken(rfPayload);
    const hashedRt = await bcrypt.hash(
      newRefreshToken,
      +this.configService.getOrThrow('REFRESH_TOKEN_SALT_ROUNDS'),
    );

    await this.saveRefreshToken(userId, hashedRt);

    return newRefreshToken;
  }
}
