import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { AddAddressDto } from './dto/add-address.dto';
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

  // TODO:
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

  // // TODO:
  // @Patch('/:id')
  // async updateUser(
  //   @Param('id') userId: string,
  //   @Body() updateUserInfoDto: UpdateUserInfoDto,
  // ) {}

  // address관련
  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  async getAddresses(@GetCurrentUser('id') userId: string) {
    const addresses = await this.usersService.getAddresses(userId);

    return { message: 'get addresses', data: addresses };
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  async addAddress(
    @GetCurrentUser('id') userId: string,
    @Body() addAddressDto: AddAddressDto,
  ) {
    const address = await this.usersService.addAddress(userId, addAddressDto);

    return { message: 'added address', data: address };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('address/:id')
  async deleteAddress(@Param('id') addressId: string) {
    await this.usersService.deleteAddress(addressId);

    return {
      message: 'delete address',
    };
  }
}
