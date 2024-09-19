import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/create-profile.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ROLES } from 'src/utils/const-enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  async createProfile(dto: ProfileDto, currentUser) {
    if (currentUser.id !== dto.userId && currentUser.role !== ROLES.admin) {
      throw new UnauthorizedException('Вы не можете совершить это действие');
    }
    const user = await this.userService.getUsersById(dto.userId, currentUser);
    if (!user) {
      throw new HttpException(
        `Пользователь с таким ID не найден, вы пытаетесь передать ID:${dto.userId} `,
        HttpStatus.BAD_REQUEST,
      );
    }
    const candidateProfile = await this.prismaService.profile.findUnique({
      where: { userId: dto.userId },
    });
    if (candidateProfile) {
      throw new HttpException(
        `Профиль пользователя с ID:${dto.userId}, уже существует. Вы не можете создать его снова`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const profile = await this.prismaService.profile.create({
      data: {
        ...dto,
      },
    });
    return profile;
  }

  async updateProfileById(id: number, dto: UpdateProfileDto, currentUser) {
    if (currentUser.id !== id && currentUser.role !== ROLES.admin) {
      throw new UnauthorizedException('Вы не можете совершить это действие');
    }
    const candidateProfile = await this.prismaService.profile.findUnique({
      where: { userId: id },
    });

    if (!candidateProfile) {
      throw new HttpException(
        `Не удалось найти профиль с  ID:${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedProfile = await this.prismaService.profile.update({
      where: { userId: id },
      data: {
        adress: dto?.adress,
        comment: dto?.comment,
        contactData: dto.contactData,
        firstName: dto?.firstName,
        lastName: dto?.lastName,
        preferredComunication: dto.preferredComunication,
      },
    });
    return updatedProfile;
  }
}
