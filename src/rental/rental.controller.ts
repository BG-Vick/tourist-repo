import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalService } from './rental.service';
import { ParseIntPipe } from 'src/pipes/parce-int.pipe';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRental(
    @Body() createRentalDto: CreateRentalDto,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.rentalService.createRental(createRentalDto, currentUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getRentalById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.rentalService.getRentalById(id, currentUser);
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getRentalByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.rentalService.getRentalByUserId(id, currentUser);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAllRentals() {
    return this.rentalService.getAllRentals();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  updateRentalById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRentalDto,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.rentalService.updateRentalById(id, dto, currentUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  deleteRentalById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Express.Request,
  ) {
    const currentUser = req['user'];
    return this.rentalService.deleteRentalById(id, currentUser);
  }
}
