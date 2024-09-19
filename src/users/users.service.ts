import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { BanUserDto } from './dto/ban-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAuthDataDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(data: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: 'USER',
      },
    });
    if (user) return user;
    if (!user) {
      throw new HttpException(
        'Не удалось создать пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserAuthData(dto: UpdateUserAuthDataDto) {
    const updatedAuthUser = await this.prismaService.user.update({
      where: { id: dto.userId },
      data: { email: dto.email, password: dto.password },
    });
    if (!updatedAuthUser) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return updatedAuthUser;
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
      include: {
        rentals: true,
        profile: true,
      },
    });
    return users;
  }

  async getUsersByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
      include: { rentals: true, profile: true },
    });
    return user;
  }

  async getUsersById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { rentals: true, profile: true },
    });
    return user;
  }

  async ban(dto: BanUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.banReason = dto.banReason;
    const updatedUser = await this.prismaService.user.update({
      where: { id: dto.userId },
      data: { banned: true, banReason: dto.banReason },
    });
    return updatedUser;
  }
}
