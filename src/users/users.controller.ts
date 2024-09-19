import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
//import { User } from '@prisma/client';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { ParseIntPipe } from 'src/pipes/parce-int.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение всех пользователей' })
  //@ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить пользователя по id' })
  //@ApiResponse({ status: 200, type: User })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUsersById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.usersService.getUsersById(id, currentUser);
  }

  @ApiOperation({ summary: 'Заблокировать пользователя' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/ban')
  @UsePipes(new ValidationPipe({ transform: true }))
  ban(@Body() banUserDto: BanUserDto) {
    return this.usersService.ban(banUserDto);
  }
}
