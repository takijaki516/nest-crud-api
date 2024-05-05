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

    response.cookie('access_token', accessToken, {
      secure: true,
      httpOnly: true,
    });

    return {
      message: 'login successful',
    };
  }

  @Post('signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signup(createUserDto);

    response.cookie('access_token', accessToken, {
      secure: true,
      httpOnly: true,
    });

    return {
      message: 'user created successful',
    };
  }

  // TODO:
  @UseGuards()
  @Post('logout')
  async logout() {}

  @Delete()
  async delete() {}
}
