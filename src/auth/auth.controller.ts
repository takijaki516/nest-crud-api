import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UserInfo } from 'src/types/req-user.type';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// TODO: refresh token, HTTP status code
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.login(loginUserDto);

    response.cookie('refresh_token', accessToken, {
      // secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    return {
      message: 'login successful',
      data: accessToken,
    };
  }

  @Post('signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signup(createUserDto);

    response.cookie('access_token', accessToken, {
      // secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    return {
      message: 'user created successful',
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(
    @GetCurrentUser() user: UserInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      user.id,
    );

    res.cookie('refresh_token', refreshToken, {
      // secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    return { message: 'refresh successful', data: accessToken };
  }

  // TODO:
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @GetCurrentUser() user: UserInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    // REVIEW:
    res.clearCookie('refresh_token', {
      // secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    }); // cookie options must match

    // remove refresh token from db
    await this.authService.removeRefreshToken(user.id);
    return { message: 'logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(
    @GetCurrentUser() user: UserInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteUser(user.id);

    res.clearCookie('refresh_token', {
      // secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    }); // cookie options must match

    return { message: 'delete successful' };
  }
}
