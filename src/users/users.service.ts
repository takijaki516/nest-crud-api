import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserDto) {
    try {
      // TODO:
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
        select: {
          email: true,
          id: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('email already exists');
      }
      throw err;
    }
  }

  async getUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async changeRole(userId: string, role: 'USER' | 'ADMIN') {
    try {
      const user = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role,
        },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException('change role error');
    }
  }

  async getUsers() {
    return this.prismaService.user.findMany();
  }
}
