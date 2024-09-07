import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userReposytory: typeof User,
    private roleService: RolesService,
  ) {}
  async createUser(dto: CreateUserDto) {
    const user = await this.userReposytory.create(dto);
    const role = await this.roleService.getRoleByValue('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    const users = await this.userReposytory.findAll({ include: { all: true } });
    return users;
  }

  async getUsersByEmail(email: string) {
    const user = await this.userReposytory.findOne({
      where: { email: email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userReposytory.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (user && role) {
      await user.$add('role', user.id);
      return dto;
    }
    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }
  async ban(dto: BanUserDto) {
    const user = await this.userReposytory.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
