import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return { message: 'get users', data: users };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@GetCurrentUser('id') userId: string) {
    const user = await this.usersService.getUserById(userId);
    return { message: 'get user', data: user };
  }

  @Patch('/role/:id')
  async changeRole(@Param('id') userId: string, role: 'USER' | 'ADMIN') {
    const user = await this.usersService.changeRole(userId, role);

    return { message: 'changed role', user };
  }
}
