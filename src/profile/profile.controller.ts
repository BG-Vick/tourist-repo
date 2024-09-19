import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/create-profile.dto';
import { ParseIntPipe } from 'src/pipes/parce-int.pipe';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  createProfile(@Body() dto: ProfileDto, @Req() req: Express.Request) {
    const currentUser = req['user'];
    return this.profileService.createProfile(dto, currentUser);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  updateProfileById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.profileService.updateProfileById(id, dto, currentUser);
  }
}
