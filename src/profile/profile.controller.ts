import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/create-profile.dto';
import { ParseIntPipe } from 'src/pipes/parce-int.pipe';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  createProfile(@Body() dto: ProfileDto) {
    return this.profileService.createProfile(dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateProfileById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfileById(id, dto);
  }
}
